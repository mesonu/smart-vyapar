const { PromotionTemplate, Product } = require('../models');
const { Op } = require('sequelize');

class PromotionTemplateController {
  // Get all templates
  async getAllTemplates(req, res) {
    try {
      const { 
        is_active, 
        schedule_type,
        search,
        page = 1,
        limit = 10
      } = req.query;

      const where = {};
      
      if (is_active !== undefined) {
        where.is_active = is_active === 'true';
      }

      if (schedule_type) {
        where.schedule_type = schedule_type;
      }

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const offset = (page - 1) * limit;

      const templates = await PromotionTemplate.findAndCountAll({
        where,
        include: [{
          model: Product,
          as: 'products',
          through: { attributes: [] }
        }],
        limit,
        offset,
        order: [['created_at', 'DESC']]
      });

      res.json({
        data: templates.rows,
        pagination: {
          total: templates.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(templates.count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get template by ID
  async getTemplateById(req, res) {
    try {
      const template = await PromotionTemplate.findByPk(req.params.id, {
        include: [{
          model: Product,
          as: 'products',
          through: { attributes: [] }
        }]
      });

      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      res.json(template);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create template
  async createTemplate(req, res) {
    try {
      const template = await PromotionTemplate.create({
        ...req.body,
        user_id: req.user.id
      });

      if (req.body.product_ids) {
        await template.setProducts(req.body.product_ids);
      }

      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update template
  async updateTemplate(req, res) {
    try {
      const template = await PromotionTemplate.findByPk(req.params.id);
      
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      await template.update(req.body);

      if (req.body.product_ids) {
        await template.setProducts(req.body.product_ids);
      }

      res.json(template);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete template
  async deleteTemplate(req, res) {
    try {
      const template = await PromotionTemplate.findByPk(req.params.id);
      
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      await template.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PromotionTemplateController(); 