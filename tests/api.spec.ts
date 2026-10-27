import { test, expect } from '@playwright/test';

const BASE = 'https://restful-booker.herokuapp.com';

const booking = {
  firstname: 'Dheekshith',
  lastname: 'Tester',
  totalprice: 500,
  depositpaid: true,
  bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
  additionalneeds: 'Breakfast',
};

test.describe.serial('Restful-Booker API', () => {
  let token: string;
  let id: number;

  test('GET /ping health check', async ({ request }) => {
    const response = await request.get(`${BASE}/ping`);
    expect(response.status()).toBe(201);
  });

  test('POST /auth returns the token', async ({ request }) => {
    const response = await request.post(`${BASE}/auth`, { data: { username: 'admin', password: 'password123' } });
    expect(response.ok()).toBeTruthy();
    token = (await response.json()).token;
    expect(token).toBeTruthy();
  });

  test('POST /booking to create a booking', async ({ request }) => {
    const response = await request.post(`${BASE}/booking`, { data: booking });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    id = body.bookingid;
    expect(body.booking.firstname).toBe('Dheekshith');
  });

  test('GET /booking/id returns the booking', async ({ request }) => {
    const response = await request.get(`${BASE}/booking/${id}`, { headers: { Accept: 'application/json' } });
    expect(response.status()).toBe(200);
    expect((await response.json()).lastname).toBe('Tester');
  });

  test('PUT /booking/id updates the booking', async ({ request }) => {
    const response = await request.put(`${BASE}/booking/${id}`, {
      headers: { Cookie: `token=${token}`, Accept: 'application/json' },
      data: { ...booking, firstname: 'Updated' },
    });
    expect(response.status()).toBe(200);
    expect((await response.json()).firstname).toBe('Updated');
  });

  test('DELETE without the token is forbidden', async ({ request }) => {
    const response = await request.delete(`${BASE}/booking/${id}`);
    expect(response.status()).toBe(403);
  });

  test('DELETE /booking/id with token succeeds', async ({ request }) => {
    const response = await request.delete(`${BASE}/booking/${id}`, { headers: { Cookie: `token=${token}` } });
    expect(response.status()).toBe(201);
  });

  test('GET deleted booking returns 404', async ({ request }) => {
    const response = await request.get(`${BASE}/booking/${id}`);
    expect(response.status()).toBe(404);
  });
});
