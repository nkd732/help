const express = require('express');
const eventController = require('../../controllers/event.controller');
const router = express.Router();


// router.post('/events', eventController.addEvent);
// router.get('/whats-new-events', eventController.getNewEvents);
// router.get('/view_day_events', eventController.viewDayEvents);
// router.get('/view_month_events', eventController.viewMonthEvents);

router
  .route('/addEvent')
  .post(eventController.addEvent);

router
  .route('/whats-new-events')
  .get(eventController.whatsNewEvents);

router
  .route('/view-day-events')
  .get(eventController.viewDayEvents);
  
router
  .route('/view-month-events')
  .get(eventController.viewMonthEvents);

module.exports = router;