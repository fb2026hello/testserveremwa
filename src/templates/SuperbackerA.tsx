import {
    Body,
    Container,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Text,
} from '@react-email/components';
import * as React from 'react';

const KICKSTARTER_URL = process.env.KICKSTARTER_URL || 'https://kickstarter.com/projects/clura/clura';

interface EmailProps {
    name?: string;
}

export const SuperbackerEmailA = ({ name }: EmailProps) => (
    <Html>
        <Head />
        <Preview>A safer way to 3D print, built by an aerospace student.</Preview>
        <Body style={main}>
            <Container style={container}>
                <Text style={text}>Hi {name || 'Maker'}, I'm Fabrizio.</Text>

                <Text style={text}>
                    I'm an aerospace engineering student building an **Open Source 3D Printer Enclosure** to help the community.
                </Text>

                <Text style={text}>
                    So, you might be asking yourself: Why am I writing to you?
                </Text>

                <Text style={text}>
                    I am writing to share a solution to a problem that many makers don't consider enough until it's too late: Air Quality.
                </Text>

                {/* Inline image, looks like attachment or pasted image */}
                <Img
                    src="https://www.clura.dev/Email_hero_1.jpg"
                    width="100%"
                    height="auto"
                    alt="Clura Enclosure"
                    style={{ marginTop: '16px', marginBottom: '16px', borderRadius: '4px' }}
                />

                <Text style={text}>
                    I built <strong>Clura</strong>, the best completely open-source enclosure ecosystem featuring air filtration, environmental sensors, and more.
                </Text>

                <Text style={text}>
                    I started this project because I wanted to print in my room without destroying my lungs (3D Printing releases VOCs and particulates in the air). I wanted an affordable, feature-packed enclosure that could be adapted to any printer. None existed, so I made my own.
                </Text>

                <Text style={text}>
                    I thought that you might want to check out our <Link href="https://github.com/Cluradev/CluraEnclosure" style={link}>GitHub repo</Link> which contains everything we have ever made and our documentation page.
                </Text>

                <Text style={text}>
                    We are also launching on Kickstarter soon and if you wanted to support the project you could <Link href={KICKSTARTER_URL} style={link}>get the enclosure kit at a discounted price here</Link>.
                </Text>

                <Text style={text}>
                    Here is what Clura can do:
                    <br />• <strong>Feature 1 - Active Air Filtration:</strong> Real HEPA/Carbon scrubbing to remove VOCs.
                    <br />• <strong>Feature 2 - Filament Weight Sensing:</strong> Know exactly how much material you have left.
                    <br />• <strong>Feature 3 - Smart Ecosystem:</strong> A touch screen + sensors to monitor your print environment.
                </Text>

                <Text style={text}>
                    Best,<br />
                    Fabrizio
                </Text>
            </Container>
        </Body>
    </Html>
);

export default SuperbackerEmailA;

// Personal "Gmail" Styles
const main: React.CSSProperties = {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', // Standard Gmail/System font
};

const container: React.CSSProperties = {
    width: '100%',
    maxWidth: '600px',
    margin: '0', // Gmail often has no margin for personal emails, or we align left
    padding: '20px 0 20px 20px', // Slight padding left
    textAlign: 'left',
};

const text: React.CSSProperties = {
    fontSize: '14px', // Gmail standard size
    lineHeight: '1.5',
    color: '#000000',
    marginBottom: '16px',
};

const link: React.CSSProperties = {
    color: '#15c', // Gmail blue
    textDecoration: 'underline',
};
