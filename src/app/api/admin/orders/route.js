import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: 'service_account',
      project_id: 'glowy-1fce3',
      private_key_id: 'fe05ff439809fae202431a96618e022d7c8bad4e',
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCP8WcwLU63WWrQ\nwgBOEG+ufW4PAF9pibnNG5JK75rL56YdV8EXR0BXDTSEzT2f64iHW0ler244w/T8\nEIhBK0B5JGnrmApykiybOGAmayl/ulqo71llv3xfa1fPMDp1U9CtXHmpt7Y/nGFP\n763MCtEOMao/XU3F4CGSjNN6ueB3CZDhEo8DrZnNp7yWrYvHfWfxJn0B8LUEwXNg\noCmKG+sV7IDCamn5Ggx1D0x9BJwEcaEnsDvToIujafaJA4HHt040iv78ZnVdw8WZ\n2qiCFnHM7hx5xfcWTurl2vr9NWXZ575DQitgXERTfHPs352c9C2nCquqISQVrEvV\notYI3wUXAgMBAAECggEADP4xs0k+WWcqhiIiMZRi5bGQFViSRDjYsFP0dkEp4Y1N\nEvRQi0+01hFsvoQMM6WTaFcWyK412SKPDZBXIZLMOg3NuyS5OghJxc+763ExiMRY\nhKE+ROSY+b/7EspRVzUz7pdx//ODnDr7FGJtIgWOmKURBLE2YPh571GOO/4P7eP+\nJaA9JIiaRRwykrud6hPhccqr1vrSDdZiERfkJ6lkAb/bkBQkrDpG5WQ5sD0SsYbk\njPNBDD8qh89Xy201khweD5WW8IKUsucomfgjAhnJ1lGo7/mcKfhLVZIQ08ZY/P6k\nKaV//sG+dYEMnrm+KuRHVqwrx1PXRJjKhBH/pByI8QKBgQDHQ6oaKMyfH6MeDAHE\nRpwBB62XbomImu3q1cYushZ914a//iHVdRmBQeSKck9tXyQO82Nha0SBPQ6UKWhs\njW3kqd6LHvGEzJqdf+6KPgkjA8NfV18yxXmxk+KYMaKEyxt7Z8HVoe7c8+/Cx0S0\nkQdmcOdLJHV9K4yBVB505O7qnwKBgQC47WC4Y11RCkKLhKXHhEPJXLkIH9DkhQqv\nJt+yIelBMr96LHV+7yrcfAlnayJ0TopPspIJELCQ8U3FEI6IhvCtR6Q43NQT6oeW\n7Dw/+yvggJLKGpLmuRsKwyGcFWwK/aXxDi0pYD5ayK+F3gbxjwdTF7GhivO8lzxY\n/MVKNt7KiQKBgQCePTG8DGJSiwEyPz6364q/lqVX+EPn44DEWHdFZc9Op/UuSlX7\n+T4D05v2BcjlhgRQix+EoXaJWz9UkX2HltiKGgvMVwpc905hfNKlnZYL5FUmRXAo\nFYIKbvInAmOZKOHuIftf93SEqoLgHvaEnhdOVqKWnaFfgVHW8kIteg/w6QKBgC1Z\nEJnGzBBearkZ2ylU9uZ/FWS3oJsZQOh4qOxewntZfXjxRBLPhXwx8oBo1jcdN2+Z\nw5PzgsjYU5DaoYk7RfPIGK5VALCtl3hcD95EsprIDLcA0zs+8zGtbiV/X1JGpxW4\nuzxlPIU4p0o1ixBbWZl3uvh5QZHiqErOGXc8g1+5AoGBALSXfOrz18dOo0IFphx8\nEJ5xFR3B6w8assYUND66gTx63IfpeBJCfZ8YI1y4E4zVbbDt78PV7BqYq7w902zo\nGZ/NWv2xE8+5r37ESNGBodnWoU4LS8LhH0YnMIT0pxi/9K98QUmEPO7Dua4+RW2x\npFn+AP+KZOge5XFWzmw29NZL\n-----END PRIVATE KEY-----\n',
      client_email: 'firebase-adminsdk-ifpoa@glowy-1fce3.iam.gserviceaccount.com',
      client_id: '115151088645260671281',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ifpoa%40glowy-1fce3.iam.gserviceaccount.com',
      universe_domain: 'googleapis.com',
    }),
  });
}

const db = admin.firestore();

export const dynamic = 'force-dynamic';

// GET /api/admin/orders?status=pending&limit=5&after=1672531200000
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const limitParam = parseInt(searchParams.get('limit') || '5', 10);
    const after = searchParams.get('after'); // milliseconds timestamp for createdAt

    const limit = Math.min(Math.max(isNaN(limitParam) ? 5 : limitParam, 1), 50); // cap 1..50

    let q = db.collection('orders').orderBy('createdAt', 'desc');

    if (status && status !== 'all') {
      q = q.where('status', '==', status);
    }

    if (after) {
      const afterMillis = Number(after);
      if (!isNaN(afterMillis)) {
        const ts = admin.firestore.Timestamp.fromMillis(afterMillis);
        q = q.startAfter(ts);
      }
    }

    q = q.limit(limit);

    const snapshot = await q.get();

    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      // normalize createdAt to millis if present
      const createdAt = data.createdAt && data.createdAt.toMillis ? data.createdAt.toMillis() : null;
      return {
        id: doc.id,
        ...data,
        createdAt,
      };
    });

    const nextCursor = items.length === limit ? items[items.length - 1].createdAt : null;

    return NextResponse.json(
      { items, nextCursor },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
