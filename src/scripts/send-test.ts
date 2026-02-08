import { Resend } from 'resend';
import { render } from '@react-email/render';
import * as dotenv from 'dotenv';
import SuperbackerEmailA from '../templates/SuperbackerA';
import SuperbackerEmailB from '../templates/SuperbackerB';
import SuperbackerEmailC from '../templates/SuperbackerC';
import InstagramEmailA from '../templates/InstagramA';
import InstagramEmailB from '../templates/InstagramB';
import InstagramEmailC from '../templates/InstagramC';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const TEST_RECIPIENT = 'fabrifibra2005@gmail.com';
const SENDER = 'Fabrizio <fabri@launch.clura.dev>'; // Using one of the verified domains

async function sendTest(template: any, subject: string, version: string) {
    console.log(`Sending ${version}...`);
    const html = render(template);

    try {
        const data = await resend.emails.send({
            from: SENDER,
            to: TEST_RECIPIENT,
            subject: `[TEST] ${subject}`,
            html: html,
        });

        if (data.error) {
            console.error(`Failed ${version}:`, data.error);
        } else {
            console.log(`✅ Sent ${version}`);
        }
    } catch (err) {
        console.error(`Error sending ${version}:`, err);
    }
}

async function main() {
    console.log(`Sending 6 Test Emails to ${TEST_RECIPIENT}...`);

    // Superbackers
    await sendTest(SuperbackerEmailA({ name: 'Fabrizio' }), 'Superbacker A: Open Source hardware...', 'Superbacker A');
    await new Promise(r => setTimeout(r, 1000));
    await sendTest(SuperbackerEmailB({ name: 'Fabrizio' }), 'Superbacker B: Open source hardware + Aero...', 'Superbacker B');
    await new Promise(r => setTimeout(r, 1000));
    await sendTest(SuperbackerEmailC({ name: 'Fabrizio' }), 'Superbacker C: The 3D printer enclosure...', 'Superbacker C');
    await new Promise(r => setTimeout(r, 1000));

    // Instagram
    await sendTest(InstagramEmailA({ name: 'Fabrizio' }), 'Instagram A: Join the Open Source...', 'Instagram A');
    await new Promise(r => setTimeout(r, 1000));
    await sendTest(InstagramEmailB({ name: 'Fabrizio' }), 'Instagram B: Safe, Affordable...', 'Instagram B');
    await new Promise(r => setTimeout(r, 1000));
    await sendTest(InstagramEmailC({ name: 'Fabrizio' }), 'Instagram C: Building the future...', 'Instagram C');

    console.log('Done.');
}

main();
