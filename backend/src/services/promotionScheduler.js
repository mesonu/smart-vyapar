const { Promotion, PromotionTemplate, PromotionSchedule } = require('../models');
const { Op } = require('sequelize');

class PromotionScheduler {
  constructor() {
    this.schedulePromotions = this.schedulePromotions.bind(this);
  }

  async schedulePromotions() {
    try {
      // Get all pending schedules
      const schedules = await PromotionSchedule.findAll({
        where: {
          status: 'pending',
          next_run_at: {
            [Op.lte]: new Date()
          }
        },
        include: ['template']
      });

      for (const schedule of schedules) {
        await this.processSchedule(schedule);
      }
    } catch (error) {
      console.error('Error scheduling promotions:', error);
    }
  }

  async processSchedule(schedule) {
    try {
      const { template } = schedule;

      // Create new promotion from template
      const promotion = await Promotion.create({
        name: template.name,
        description: template.description,
        discount_type: template.discount_type,
        discount_value: template.discount_value,
        min_purchase_amount: template.min_purchase_amount,
        max_discount_amount: template.max_discount_amount,
        start_date: schedule.start_date,
        end_date: schedule.end_date,
        is_active: true,
        user_id: schedule.user_id
      });

      // Associate products from template
      if (template.products && template.products.length > 0) {
        await promotion.setProducts(template.products.map(p => p.id));
      }

      // Update schedule
      await schedule.update({
        last_run_at: new Date(),
        run_count: schedule.run_count + 1,
        status: this.getNextScheduleStatus(schedule)
      });

      // Calculate next run time
      const nextRunAt = this.calculateNextRunTime(schedule);
      if (nextRunAt) {
        await schedule.update({ next_run_at: nextRunAt });
      }
    } catch (error) {
      console.error('Error processing schedule:', error);
      await schedule.update({ status: 'cancelled' });
    }
  }

  getNextScheduleStatus(schedule) {
    const now = new Date();
    if (now > schedule.end_date) {
      return 'completed';
    }
    return 'pending';
  }

  calculateNextRunTime(schedule) {
    const { schedule_type, schedule_config } = schedule.template;
    const now = new Date();

    switch (schedule_type) {
      case 'daily':
        return new Date(now.setDate(now.getDate() + 1));
      
      case 'weekly':
        const daysToAdd = schedule_config?.day_of_week || 7;
        return new Date(now.setDate(now.getDate() + daysToAdd));
      
      case 'monthly':
        const nextMonth = new Date(now.setMonth(now.getMonth() + 1));
        return new Date(nextMonth.setDate(schedule_config?.day_of_month || 1));
      
      case 'yearly':
        const nextYear = new Date(now.setFullYear(now.getFullYear() + 1));
        return new Date(nextYear.setMonth(schedule_config?.month || 0, schedule_config?.day || 1));
      
      default:
        return null;
    }
  }
}

module.exports = new PromotionScheduler(); 