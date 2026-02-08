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
} from "@react-email/components";
import * as React from "react";

const KICKSTARTER_URL = process.env.KICKSTARTER_URL || 'https://kickstarter.com/projects/clura/clura';

interface EmailProps {
    name?: string;
}

export const InstagramEmailB = ({ name }: EmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Upgrade your setup with active filtration and smart sensors.</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Img
                        src="https://www.clura.dev/Email_logo_1.jpg"
                        alt="Clura"
                        width="140"
                        style={logo}
                    />

                    <Img
                        src="https://www.clura.dev/Email_hero_1.jpg"
                        alt="Clura Enclosure"
                        style={heroImage}
                    />

                    <Text style={text}>
                        Hi {name || 'Maker'}, I'm Fabrizio.
                    </Text>

                    <Text style={text}>
                        A while back, I was looking for an enclosure for my Prusa. I saw the main options on the market costing nearly €500 when picked out with some features.
                        <br /><br />
                        <strong>I didn't want to spend €500 on a box.</strong>
                    </Text>

                    <Text style={text}>
                        Especially one that didn't even have smart sensors. I felt I could do better—create something affordable that wasn't just "a box," but a whole ecosystem for my printer.
                    </Text>

                    <Section style={box}>
                        <Heading as="h3" style={{ ...h3, marginTop: 0 }}>So I built Clura.</Heading>
                        <Text style={{ ...text, padding: 0, marginBottom: '12px' }}>
                            It’s an upgrade for your entire printing experience. It’s not just about saving money; it’s about getting more features than the expensive industrial options:
                        </Text>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            <li style={listItem}>
                                <strong>Safety:</strong> Active air circulation through HEPA/Carbon filters to scrub VOCs (essential if you print indoors).
                            </li>
                            <li style={listItem}>
                                <strong>Smarts:</strong> Smart screen that tracks temperature, humidity, and air quality in real-time.
                            </li>
                            <li style={listItem}>
                                <strong>Filament Tracking:</strong> Weighs your spool as you print, so you never fail a print due to running out of material.
                            </li>
                        </ul>
                    </Section>

                    <Text style={text}>
                        I'm launching this project soon to help other makers upgrade their setup without the crazy price tag.
                    </Text>

                    <Section style={{ padding: "16px 0 16px", textAlign: "center" as const }}>
                        <Button href={KICKSTARTER_URL} style={buttonKickstarter}>
                            Follow the Project
                        </Button>
                    </Section>

                    <Hr style={hr} />

                    <Text style={text}>
                        Don't settle for overpriced gear. Build better.
                        <br />
                        Fabrizio
                    </Text>

                    <Text style={footerLinks}>
                        <Link href="https://clura.dev" style={link}>Visit Website</Link> • <Link href="https://clura.dev/unsubscribe" style={link}>Unsubscribe</Link>
                        <br />
                        <br />
                        Clura Srls.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default InstagramEmailB;

// STYLES (Brand)
const main: React.CSSProperties = {
    backgroundColor: "#f6f9fc",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    padding: "40px 0",
};

const container: React.CSSProperties = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "40px 0 48px",
    marginBottom: "64px",
    borderRadius: "8px",
    maxWidth: "600px",
    border: "1px solid #f0f0f0",
};

const logo: React.CSSProperties = {
    display: "block",
    margin: "0 auto 24px auto",
};

const heroImage: React.CSSProperties = {
    display: "block",
    maxWidth: "100%",
    width: "calc(100% - 80px)",
    margin: "0 auto 32px auto",
    borderRadius: "12px",
    border: "1px solid #eaeaea",
    height: "auto",
};

const text: React.CSSProperties = {
    color: "#333",
    fontSize: "16px",
    lineHeight: "26px",
    padding: "0 40px",
    marginBottom: "20px",
    marginTop: "0",
};

const box: React.CSSProperties = {
    padding: "24px 30px",
    backgroundColor: "#fafafa",
    margin: "0 40px 24px 40px",
    borderRadius: "8px",
    border: "1px solid #eaeaea",
    width: "auto",
};

const h3: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: "12px",
};

const listItem: React.CSSProperties = {
    fontSize: "15px",
    lineHeight: "24px",
    color: "#444",
    marginBottom: "8px",
};

const buttonKickstarter: React.CSSProperties = {
    backgroundColor: "#05CE78", // Kickstarter Green
    color: "#ffffff",
    padding: "14px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center" as const,
};

const hr: React.CSSProperties = {
    borderColor: "#e6ebf1",
    margin: "32px 40px",
    borderTop: "1px solid #e6ebf1",
};

const footerLinks: React.CSSProperties = {
    color: "#aaa",
    fontSize: "12px",
    marginTop: "24px",
    padding: "0 40px",
    textAlign: "center" as const,
};

const link: React.CSSProperties = {
    color: "#888",
    textDecoration: "underline",
};
