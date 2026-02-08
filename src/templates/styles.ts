import * as React from 'react';

export const main: React.CSSProperties = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

export const container: React.CSSProperties = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '600px',
    width: '100%',
};

export const heading: React.CSSProperties = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '400',
    color: '#484848',
    padding: '17px 0 0',
};

export const paragraph: React.CSSProperties = {
    margin: '0 0 15px',
    fontSize: '15px',
    lineHeight: '1.4',
    color: '#3c4149',
};

export const button: React.CSSProperties = {
    backgroundColor: '#000000',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block',
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
};

export const buttonKickstarter: React.CSSProperties = {
    ...button,
    backgroundColor: '#05CE78', // Kickstarter Green
    color: '#ffffff',
};

export const buttonGithub: React.CSSProperties = {
    ...button,
    backgroundColor: '#24292e', // GitHub Black
    color: '#ffffff',
};

export const buttonWebsite: React.CSSProperties = {
    ...button,
    backgroundColor: '#000000', // Default Black for website
    color: '#ffffff',
};

export const link: React.CSSProperties = {
    color: '#000000',
    textDecoration: 'underline',
};

export const anchor: React.CSSProperties = {
    color: '#556cd6',
};

export const hr: React.CSSProperties = {
    borderColor: '#dfe1e4',
    margin: '42px 0 26px',
};

export const footer: React.CSSProperties = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
};
