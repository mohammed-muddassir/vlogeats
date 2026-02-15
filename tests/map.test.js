const app = require('../app.js');

describe('App Logic', () => {
    test('escapeHTML sanitizes inputs', () => {
        const input = '<script>alert("xss")</script>';
        const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
        expect(app.escapeHTML(input)).toBe(expected);
    });

    test('parseTime converts 12:00 PM to 720 minutes', () => {
        expect(app.parseTime("12:00 PM")).toBe(720);
    });

    test('parseTime converts 12:30 AM to 30 minutes', () => {
        expect(app.parseTime("12:30 AM")).toBe(30);
    });

    test('createReviewCard returns correctly structured HTML', () => {
        const review = {
            location_name: "Test Spot",
            category: "Test Cat",
            business_type: "Test Type",
            menu_highlights: [{ item: "Food", price_estimate: 100 }],
            operating_hours: "10:00 AM - 10:00 PM",
            location_coordinates: { lat: 10, lng: 10 },
            social_proof: {
                top_vlogger: "Test Vlogger",
                sentiment_score: 9.0,
                community_note: "Note",
                is_promotion: false
            }
        };

        const card = app.createReviewCard(review);
        expect(card.tagName).toBe('DIV');
        expect(card.innerHTML).toContain('Test Spot');
        expect(card.innerHTML).toContain('Test Cat');
        expect(card.querySelector('.category-test-cat')).toBeTruthy();
    });
});
