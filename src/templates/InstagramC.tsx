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

export const InstagramEmailC = ({ name }: EmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Seriously. I just want you to print safely. Here is how.</Preview>
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
                        I know you must see a lot of posts and emails like this—**3D printer enclosures** and gadgets trying to hype you up.
                        <br /><br />
                        To be honest, I initially did not want to send this. I felt that it made our project look like all of these "companies" just trying to sell you something. <strong>But we're different.</strong> Everything I have ever made is open source and available on my github.
                    </Text>

                    <Text style={text}>
                        I have spent the last 18 months of my life working on this project as an aerospace engineering student. My goal isn't just to sell units; it is to help as many makers as possible safeguard their health when 3d printing.
                    </Text>

                    <Section style={box}>
                        <Heading as="h3" style={{ ...h3, marginTop: 0 }}>This is Clura.</Heading>
                        <Text style={{ ...text, padding: 0, marginBottom: '12px' }}>
                            Unlike generic acrylic boxes, Clura is an engineered system involving:
                        </Text>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            <li style={listItem}>
                                <strong>Smart Sensing:</strong> Integrated environmental sensors (VOC, PM2.5, Temp) running on custom open firmware.
                            </li>
                            <li style={listItem}>
                                <strong>Active Filtration:</strong> Not just a fan, but a scrubbing loop designed to actually trap harmful particles.
                            </li>
                            <li style={listItem}>
                                <strong>Filament Intelligence:</strong> A built-in load cell system that tracks filament usage by weight.
                            </li>
                        </ul>
                    </Section>

                    <Text style={text}>
                        Here is the deal: I don't care if you choose to self-source the components following our Bill of Materials, or if you buy our kit to support us.
                        <br /><br />
                        All I care is that I have helped another maker with something that I care deeply about.
                    </Text>

                    <Section style={{ padding: "16px 0 16px", textAlign: "center" as const }}>
                        <Button href={KICKSTARTER_URL} style={buttonKickstarter}>
                            Follow the Project
                        </Button>
                        <Text style={{ ...caption, marginTop: "12px" }}>
                            Or <Link style={link} href="https://github.com/Cluradev/CluraEnclosure">view on Gitub</Link>
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    <Text style={text}>
                        I hope this helps your setup.
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

export default InstagramEmailC;

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

const caption: React.CSSProperties = {
    fontSize: "14px",
    color: "#666",
    margin: "0",
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
