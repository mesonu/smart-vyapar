const { Promotion, PromotionSchedule, User } = require('../models');
const notificationService = require('./notificationService');

class PromotionNotificationService {
  async notifyPromotionCreated(promotion) {
    try {
      const user = await User.findByPk(promotion.user_id);
      const subject = 'New Promotion Created';
      const message = `
        A new promotion has been created:
        Name: ${promotion.name}
        Description: ${promotion.description}
        Discount: ${promotion.discount_value}${promotion.discount_type === 'percentage' ? '%' : ' INR'}
        Valid from: ${promotion.start_date.toLocaleDateString()}
        Valid until: ${promotion.end_date.toLocaleDateString()}
      `;

      await notificationService.sendEmail(user.email, subject, message);
      await notificationService.sendWhatsApp(user.phone, message);
    } catch (error) {
      console.error('Error sending promotion creation notification:', error);
    }
  }

  async notifyPromotionScheduled(schedule) {
    try {
      const user = await User.findByPk(schedule.user_id);
      const template = await schedule.getTemplate();
      const subject = 'Promotion Scheduled';
      const message = `
        A promotion has been scheduled:
        Template: ${template.name}
        Start Date: ${schedule.start_date.toLocaleDateString()}
        End Date: ${schedule.end_date.toLocaleDateString()}
        Schedule Type: ${template.schedule_type}
        Next Run: ${schedule.next_run_at.toLocaleDateString()}
      `;

      await notificationService.sendEmail(user.email, subject, message);
      await notificationService.sendWhatsApp(user.phone, message);
    } catch (error) {
      console.error('Error sending schedule notification:', error);
    }
  }

  async notifyPromotionExpiring(promotion) {
    try {
      const user = await User.findByPk(promotion.user_id);
      const subject = 'Promotion Expiring Soon';
      const message = `
        The following promotion is expiring soon:
        Name: ${promotion.name}
        Expiry Date: ${promotion.end_date.toLocaleDateString()}
        Days Remaining: ${Math.ceil((promotion.end_date - new Date()) / (1000 * 60 * 60 * 24))}
      `;

      await notificationService.sendEmail(user.email, subject, message);
      await notificationService.sendWhatsApp(user.phone, message);
    } catch (error) {
      console.error('Error sending expiration notification:', error);
    }
  }

  async notifyPromotionPerformance(promotion, analytics) {
    try {
      const user = await User.findByPk(promotion.user_id);
      const subject = 'Promotion Performance Report';
      const message = `
        Promotion Performance Report:
        Name: ${promotion.name}
        Total Uses: ${analytics.total_uses}
        Total Revenue: ${analytics.total_revenue} INR
        Total Discount: ${analytics.total_discount} INR
        Average Order Value: ${analytics.average_order_value} INR
        Conversion Rate: ${analytics.conversion_rate}%
      `;

      await notificationService.sendEmail(user.email, subject, message);
    } catch (error) {
      console.error('Error sending performance notification:', error);
    }
  }
}

module.exports = new PromotionNotificationService(); 