import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Hr,
} from '@react-email/components';
import * as React from 'react';
import { main, container, heading, paragraph, button, buttonKickstarter, link, hr } from './styles';

const KICKSTARTER_URL = process.env.KICKSTARTER_URL || 'https://kickstarter.com/projects/clura/clura';

export const SuperbackerEmailC = () => (
    <Html>
        <Head />
        <Preview>Meet Clura: 100% Open Source. Smart Sensors. Active Filtration.</Preview>
        <Body style={main}>
            <Container style={container}>
                <Text style={paragraph}>Hi, I'm Fabrizio.</Text>
                <Text style={paragraph}>I'm an aerospace engineering student, but really, I'm just a maker who got tired of proprietary hardware.</Text>
                <Text style={paragraph}>
                    I wanted to print safely in my room, but the only good enclosures on the market were closed-source, expensive, and unmodifiable. The cheap ones were just fire hazards.
                </Text>

                <Text style={paragraph}>
                    <strong>I wished someone had built a high-quality, open-source ecosystem.</strong> No one did, so I spent the last 18 months building it myself.
                </Text>

                <Img
                    src="https://www.clura.dev/Email_hero_1.jpg"
                    width="100%"
                    height="auto"
                    alt="Clura Enclosure"
                    style={{ marginTop: '16px', marginBottom: '16px', borderRadius: '4px' }}
                />

                <Heading style={heading}>Meet Clura.</Heading>
                <Text style={paragraph}>Clura is built on the philosophy that you should own your hardware.</Text>
                <Text style={paragraph}>• <strong>100% Open Source:</strong> Every STL, PCB design, and line of code is available.</Text>
                <Text style={paragraph}>• <strong>Community Driven:</strong> Designed to be hacked, modified, and improved by you.</Text>
                <Text style={paragraph}>• <strong>Health First:</strong> Professional-grade air filtration to stop VOCs and micro-plastics from damaging your lungs.</Text>

                <Text style={paragraph}>
                    We are launching on Kickstarter to get these kits into the hands of makers, but the source code is live right now.
                </Text>
                <Text style={paragraph}>
                    If you believe in open hardware that actually protects your health, check us out.
                </Text>

                <Section style={{ textAlign: 'center', marginTop: '32px', marginBottom: '32px' }}>
                    <Button style={buttonKickstarter} href={KICKSTARTER_URL}>
                        Support us on Kickstarter
                    </Button>
                    <Text style={{ textAlign: 'center', marginTop: '16px' }}>
                        <Link style={link} href="https://github.com/Cluradev/CluraEnclosure">Check the Source Code</Link>
                    </Text>
                </Section>

                <Text style={paragraph}>
                    Happy Printing,
                    <br />
                    Fabrizio
                </Text>
                <Hr style={hr} />
            </Container>
        </Body>
    </Html>
);

export default SuperbackerEmailC;
