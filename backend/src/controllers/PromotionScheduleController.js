const { PromotionSchedule, Promotion } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class PromotionScheduleController extends BaseController {
  constructor() {
    super(PromotionSchedule);
  }

  createSchedule = async (req, res) => {
    try {
      const {
        promotionId,
        startDate,
        endDate,
        recurrence,
        timezone,
        isActive = true
      } = req.body;

      // Validate promotion exists
      const promotion = await Promotion.findByPk(promotionId);
      if (!promotion) {
        return this.ResponseHandler.notFound(res, 'Promotion not found');
      }

      // Validate date range
      if (new Date(startDate) >= new Date(endDate)) {
        return this.ResponseHandler.badRequest(res, 'End date must be after start date');
      }

      // Check for overlapping schedules
      const overlappingSchedule = await PromotionSchedule.findOne({
        where: {
          promotionId,
          [Op.or]: [
            {
              startDate: { [Op.lte]: endDate },
              endDate: { [Op.gte]: startDate }
            }
          ]
        }
      });

      if (overlappingSchedule) {
        return this.ResponseHandler.conflict(res, 'Schedule overlaps with existing promotion schedule');
      }

      const schedule = await PromotionSchedule.create({
        promotionId,
        startDate,
        endDate,
        recurrence,
        timezone,
        isActive
      });

      logger.info('Promotion schedule created successfully', { scheduleId: schedule.id });
      return this.ResponseHandler.created(res, schedule, 'Promotion schedule created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllSchedules = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        promotionId,
        isActive,
        startDate,
        endDate,
        sortBy = 'startDate',
        sortOrder = 'ASC'
      } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({
        promotionId,
        isActive,
        startDate,
        endDate
      });

      const { count, rows: schedules } = await PromotionSchedule.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: Promotion,
            attributes: ['id', 'name', 'description']
          }
        ],
        order: [[sortBy, sortOrder]]
      });

      return this.ResponseHandler.success(res, {
        schedules,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getScheduleById = async (req, res) => {
    try {
      const schedule = await PromotionSchedule.findByPk(req.params.id, {
        include: [
          {
            model: Promotion,
            attributes: ['id', 'name', 'description', 'discountType', 'discountValue']
          }
        ]
      });

      if (!schedule) {
        return this.ResponseHandler.notFound(res, 'Schedule not found');
      }

      return this.ResponseHandler.success(res, schedule);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateSchedule = async (req, res) => {
    try {
      const schedule = await PromotionSchedule.findByPk(req.params.id);
      if (!schedule) {
        return this.ResponseHandler.notFound(res, 'Schedule not found');
      }

      const {
        startDate,
        endDate,
        recurrence,
        timezone,
        isActive
      } = req.body;

      // Validate date range if being updated
      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        return this.ResponseHandler.badRequest(res, 'End date must be after start date');
      }

      // Check for overlapping schedules if dates are being updated
      if (startDate || endDate) {
        const overlappingSchedule = await PromotionSchedule.findOne({
          where: {
            promotionId: schedule.promotionId,
            id: { [Op.ne]: schedule.id },
            [Op.or]: [
              {
                startDate: { [Op.lte]: endDate || schedule.endDate },
                endDate: { [Op.gte]: startDate || schedule.startDate }
              }
            ]
          }
        });

        if (overlappingSchedule) {
          return this.ResponseHandler.conflict(res, 'Schedule overlaps with existing promotion schedule');
        }
      }

      const updatedSchedule = await schedule.update({
        startDate,
        endDate,
        recurrence,
        timezone,
        isActive
      });

      logger.info('Schedule updated successfully', { scheduleId: schedule.id });
      return this.ResponseHandler.success(res, updatedSchedule, 'Schedule updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  deleteSchedule = async (req, res) => {
    try {
      const schedule = await PromotionSchedule.findByPk(req.params.id);
      if (!schedule) {
        return this.ResponseHandler.notFound(res, 'Schedule not found');
      }

      await schedule.destroy();

      logger.info('Schedule deleted successfully', { scheduleId: schedule.id });
      return this.ResponseHandler.success(res, null, 'Schedule deleted successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getActiveSchedules = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const now = new Date();
      const { count, rows: schedules } = await PromotionSchedule.findAndCountAll({
        where: {
          isActive: true,
          startDate: { [Op.lte]: now },
          endDate: { [Op.gte]: now }
        },
        limit,
        offset,
        include: [
          {
            model: Promotion,
            attributes: ['id', 'name', 'description', 'discountType', 'discountValue']
          }
        ],
        order: [['startDate', 'ASC']]
      });

      return this.ResponseHandler.success(res, {
        schedules,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getUpcomingSchedules = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const now = new Date();
      const { count, rows: schedules } = await PromotionSchedule.findAndCountAll({
        where: {
          isActive: true,
          startDate: { [Op.gt]: now }
        },
        limit,
        offset,
        include: [
          {
            model: Promotion,
            attributes: ['id', 'name', 'description', 'discountType', 'discountValue']
          }
        ],
        order: [['startDate', 'ASC']]
      });

      return this.ResponseHandler.success(res, {
        schedules,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  buildWhereClause = (filters) => {
    const where = {};
    const { promotionId, isActive, startDate, endDate } = filters;

    if (promotionId) where.promotionId = promotionId;
    if (isActive !== undefined) where.isActive = isActive;

    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) where.startDate[Op.gte] = startDate;
      if (endDate) where.startDate[Op.lte] = endDate;
    }

    return where;
  };
}

module.exports = new PromotionScheduleController(); 