day:
app.get('/view_day_events', (req, res) => {
    const eventType = req.query.event_type; // Can be 'GSB', 'personal', or empty (both)
    const chosenDate = req.query.chosen_date; // Should be in 'YYYY-MM-DD' format

    // Check if chosen_date is provided
    if (!chosenDate) {
        return res.status(400).json({ error: 'Chosen date parameter is required' });
    }

    // Construct start_time and end_time based on chosen_date
    const startTime = `${chosenDate} 00:00:00`;
    const endTime = `${chosenDate} 23:59:59`;
    
    // mapping event_type to numeric code
    const eventTypeCodes = {
        'GSB': 1,
        'personal': 2
    };

    // Construct the basic query without event_type condition
    let query = `
        SELECT event_id, event_name, event_details, start_time, end_time, venue, event_type 
        FROM events 
        WHERE start_time >= ? AND end_time <= ?
    `;
    const queryParams = [startTime, endTime];

    // Check if eventType is provided and handle different cases
    if (eventType) {
        const eventTypes = eventType.split(',').map(type => type.trim());
        const typePlaceholders = eventTypes.map(() => '?').join(',');
        query += ` AND event_type IN (${typePlaceholders})`;
        queryParams.push(...eventTypes);
    }

    // Execute the query
    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve events' });
        }

        // Handle case where no events are found
        if (results.length === 0) {
            return res.json({
                message: 'No events found',
                events: []
            });
        }

        // Map results to the desired format
        const events = results.map(event => ({
            event_id: event.event_id,
            event_name: event.event_name,
            event_details: event.event_details,
            start_time: event.start_time,
            end_time: event.end_time,
            venue: event.venue,
            event_type_code: eventTypeCodes[event.event_type] || 0 // Default to 0 if type not found
        }));

        // Send the response with the events
        res.json({ events });
    });
});

////////////////////////////////////////////////////////////////////////////////////////
month:

app.get('/view_month_events', (req, res) => {
    // Define eventTypeCodes mapping
    const eventTypeCodes = {
        'GSB': 1,
        'personal': 2
    };

    const currentYear = new Date().getFullYear(); // Get current year
    const month = req.query.month; // Month of the year (1-12)
    const event_type = req.query.event_type; // Optional event_type parameter

    // Validate month parameter
    if (!month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ error: 'Month parameter is required and must be valid' });
    }

    // Construct start_date and end_date based on the month and current year
    const startDate = `${currentYear}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${currentYear}-${month.toString().padStart(2, '0')}-31`; // Assuming 31 days for simplicity; can adjust based on actual days in month

    // Construct the base query to retrieve event types grouped by each day
    let query = `
        SELECT DATE(start_time) AS event_date, GROUP_CONCAT(DISTINCT event_type) AS event_types
        FROM events
        WHERE start_time >= ? AND start_time <= ?
    `;
    const queryParams = [startDate, endDate];

    // Adjust query and parameters if event_type is provided
    if (event_type) {
        const eventTypes = event_type.split(',').map(type => type.trim());
        const typePlaceholders = eventTypes.map(() => '?').join(',');
        query += ` AND event_type IN (${typePlaceholders})`;
        queryParams.push(...eventTypes);
    }

    // Complete the query with GROUP BY clause
    query += ` GROUP BY event_date`;

    // Execute the query
    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve month events' });
        }

        // Handle case where no events are found
        if (results.length === 0) {
            return res.json({
                message: 'No events found for the specified month',
                month_events: []
            });
        }

        // Map results to the desired format
        const month_events = results.map(event => ({
            event_date: new Date(event.event_date).toISOString().split('T')[0], // Convert to Date object first
            event_type_codes: event.event_types.split(',').map(type => ({
                event_type_code: eventTypeCodes[type] || 0 // Default to 0 if type not found
            }))
        }));

        // Send the response with the month events
        res.json({ month_events });
    });
});