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

interface EmailProps {
    name?: string;
}

export const InstagramEmailA = ({ name }: EmailProps) => (
    <Html>
        <Head />
        <Preview>Stop breathing fumes. Start printing smarter.</Preview>
        <Body style={main}>
            <Container style={container}>
                <Text style={text}>Hi {name || 'Maker'}! I'm Fabrizio.</Text>

                <Text style={text}>
                    I'm an aerospace engineering student, but mostly I'm just a guy who loves 3D printing and tinkering with **open source enclosures**.
                </Text>

                <Text style={text}>
                    I'm writing to you because, like you, I spend a lot of time around my printer. But there was always one thing that bugged me: the fumes.
                </Text>

                <Img
                    src="https://www.clura.dev/Email_hero_1.jpg"
                    width="100%"
                    height="auto"
                    alt="Clura Enclosure"
                    style={{ marginTop: '16px', marginBottom: '16px', borderRadius: '4px' }}
                />

                <Text style={text}>
                    So, what did I build? I built <strong>Clura</strong>. It’s the enclosure I always wanted but couldn't buy. It’s affordable, completely open-source, and it actually keeps the air in your workshop clean.
                </Text>

                <Text style={text}>
                    I started this project because I wanted to print in my bedroom without destroying my lungs with VOCs and particulates. Since nothing good existed, I decided to DIY the ultimate solution.
                </Text>

                <Text style={text}>
                    I figured since you follow 3D printing pages, you might dig this. I'm just here to share a solution to a problem we all have.
                </Text>

                <Text style={text}>
                    We have a <Link href="https://github.com/Cluradev/CluraEnclosure" style={link}>GitHub repo</Link> with all our files, and a documentation page if you want to see how it works. We are also launching on Kickstarter soon, so if you want to grab a kit for your setup, <Link href="https://clura.dev" style={link}>now is the time to look at clura.dev</Link>.
                </Text>

                <Text style={text}>
                    What can Clura actually do for you?
                    <br />• <strong>Air Filtration:</strong> Filters the nasty stuff so you breathe easy.
                    <br />• <strong>Filament Scale:</strong> Tells you exactly how much plastic you have left.
                    <br />• <strong>Smart Screen:</strong> Controls your printer's environment with a touch interface.
                </Text>

                <Text style={text}>
                    Cheers,<br />
                    Fabrizio
                </Text>
            </Container>
        </Body>
    </Html>
);

export default InstagramEmailA;

// Personal "Gmail" Styles
const main: React.CSSProperties = {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
};

const container: React.CSSProperties = {
    width: '100%',
    maxWidth: '600px',
    margin: '0',
    padding: '20px 0 20px 20px',
    textAlign: 'left',
};

const text: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#000000',
    marginBottom: '16px',
};

const link: React.CSSProperties = {
    color: '#15c',
    textDecoration: 'underline',
};
