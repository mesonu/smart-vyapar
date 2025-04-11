const { PromotionSchedule, PromotionTemplate } = require('../models');
const { Op } = require('sequelize');

class PromotionScheduleController {
  // Get all schedules
  async getAllSchedules(req, res) {
    try {
      const { 
        status, 
        template_id,
        start_date,
        end_date,
        page = 1,
        limit = 10
      } = req.query;

      const where = {};
      
      if (status) {
        where.status = status;
      }

      if (template_id) {
        where.template_id = template_id;
      }

      if (start_date && end_date) {
        where.start_date = {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        };
      }

      const offset = (page - 1) * limit;

      const schedules = await PromotionSchedule.findAndCountAll({
        where,
        include: [{
          model: PromotionTemplate,
          as: 'template',
          include: ['products']
        }],
        limit,
        offset,
        order: [['next_run_at', 'ASC']]
      });

      res.json({
        data: schedules.rows,
        pagination: {
          total: schedules.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(schedules.count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get schedule by ID
  async getScheduleById(req, res) {
    try {
      const schedule = await PromotionSchedule.findByPk(req.params.id, {
        include: [{
          model: PromotionTemplate,
          as: 'template',
          include: ['products']
        }]
      });

      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }

      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create schedule
  async createSchedule(req, res) {
    try {
      const template = await PromotionTemplate.findByPk(req.body.template_id);
      
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      const schedule = await PromotionSchedule.create({
        ...req.body,
        user_id: req.user.id,
        status: 'pending'
      });

      res.status(201).json(schedule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update schedule
  async updateSchedule(req, res) {
    try {
      const schedule = await PromotionSchedule.findByPk(req.params.id);
      
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }

      await schedule.update(req.body);
      res.json(schedule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete schedule
  async deleteSchedule(req, res) {
    try {
      const schedule = await PromotionSchedule.findByPk(req.params.id);
      
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }

      await schedule.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Cancel schedule
  async cancelSchedule(req, res) {
    try {
      const schedule = await PromotionSchedule.findByPk(req.params.id);
      
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }

      await schedule.update({ status: 'cancelled' });
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PromotionScheduleController(); 