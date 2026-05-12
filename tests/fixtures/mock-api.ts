import type { Page } from '@playwright/test';

export const FAKE_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLTEifQ.fake';

export const MOCK_USER = { id: 'user-1', email: 'test@example.com', name: 'Test User' };

export const MOCK_HABIT = {
  id: 'habit-1',
  name: 'Morning workout',
  emoji: '💪',
  freq: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  time: 'morning',
  target: 1,
  notes: null,
  position: 0,
};

export const MOCK_TASK = {
  id: 'task-1',
  text: 'Buy groceries',
  done: false,
  pinned: false,
  importance: 3,
  urgency: 3,
  list: 'plan',
  tagId: null,
  tag: null,
  description: null,
  deadline: null,
  reminder: null,
  position: 0,
};

export const MOCK_BOOTSTRAP = {
  user: MOCK_USER,
  habits: [MOCK_HABIT],
  habitLogs: [],
  tasks: [MOCK_TASK],
  laterTasks: [],
  tags: [],
  metrics: [],
  journal: [],
  goals: {
    waterMin: '1', waterNorm: '3', waterMax: '4',
    sleepMin: '6', sleepNorm: '8', sleepMax: '10',
    calMin: 1200, calNorm: 2000, calMax: 2800,
    stepsMin: 5000, stepsNorm: 8000, stepsMax: 15000,
  },
  profile: null,
};

/** Intercept all API calls with mock responses */
export async function mockApi(page: Page) {
  const API = 'http://localhost:3000';

  // Auth
  await page.route(`${API}/auth/login`, async (route) => {
    const body = JSON.parse(route.request().postData() || '{}');
    if (body.email === 'test@example.com' && body.password === 'password123') {
      await route.fulfill({ json: { token: FAKE_TOKEN, user: MOCK_USER } });
    } else {
      await route.fulfill({ status: 401, json: { error: 'Invalid credentials' } });
    }
  });

  await page.route(`${API}/auth/register`, async (route) => {
    await route.fulfill({ json: { token: FAKE_TOKEN, user: MOCK_USER } });
  });

  // Bootstrap
  await page.route(`${API}/bootstrap`, async (route) => {
    await route.fulfill({ json: MOCK_BOOTSTRAP });
  });

  // Habits
  await page.route(`${API}/habits`, async (route) => {
    if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({ status: 201, json: { id: 'habit-new-' + Date.now(), ...body } });
    } else {
      await route.fulfill({ json: [MOCK_HABIT] });
    }
  });

  await page.route(`${API}/habits/**`, async (route) => {
    const method = route.request().method();
    if (method === 'PATCH') {
      const body = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({ json: { ...MOCK_HABIT, ...body } });
    } else if (method === 'DELETE') {
      await route.fulfill({ status: 204, body: '' });
    } else if (method === 'POST') {
      // habit log
      await route.fulfill({ json: { id: 'log-1', habitId: 'habit-1', date: new Date().toISOString().slice(0, 10), count: '1' } });
    } else {
      await route.fulfill({ json: [] });
    }
  });

  // Tasks
  await page.route(`${API}/tasks`, async (route) => {
    if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({ status: 201, json: { id: 'task-new-' + Date.now(), ...body, tag: body.tagId } });
    } else {
      await route.fulfill({ json: [MOCK_TASK] });
    }
  });

  await page.route(`${API}/tasks/**`, async (route) => {
    const method = route.request().method();
    if (method === 'PATCH') {
      const body = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({ json: { ...MOCK_TASK, ...body } });
    } else {
      await route.fulfill({ status: 204, body: '' });
    }
  });

  // Tags
  await page.route(`${API}/tags`, async (route) => {
    if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({ json: { id: 'tag-new-' + Date.now(), ...body } });
    } else {
      await route.fulfill({ json: [] });
    }
  });

  await page.route(`${API}/tags/**`, async (route) => {
    await route.fulfill({ status: 204, body: '' });
  });

  // Metrics
  await page.route(`${API}/metrics`, async (route) => {
    if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({ json: { id: 'metric-1', ...body } });
    } else {
      await route.fulfill({ json: [] });
    }
  });

  // Journal
  await page.route(`${API}/journal`, async (route) => {
    if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({ status: 201, json: { id: 'journal-' + Date.now(), ...body } });
    } else {
      await route.fulfill({ json: [] });
    }
  });

  await page.route(`${API}/journal/**`, async (route) => {
    const method = route.request().method();
    if (method === 'PATCH') {
      await route.fulfill({ json: { id: 'journal-1' } });
    } else {
      await route.fulfill({ status: 204, body: '' });
    }
  });

  // Goals & Profile
  await page.route(`${API}/goals`, async (route) => {
    const method = route.request().method();
    if (method === 'PUT') {
      await route.fulfill({ json: {} });
    } else {
      await route.fulfill({ json: MOCK_BOOTSTRAP.goals });
    }
  });

  await page.route(`${API}/profile`, async (route) => {
    if (route.request().method() === 'PUT') {
      await route.fulfill({ json: {} });
    } else {
      await route.fulfill({ json: null });
    }
  });
}

/** Set a fake JWT token in localStorage and navigate to app */
export async function loginViaStorage(page: Page) {
  await page.goto('/');
  await page.evaluate((token) => {
    localStorage.setItem('cht_tok', token);
  }, FAKE_TOKEN);
  await page.reload();
}
