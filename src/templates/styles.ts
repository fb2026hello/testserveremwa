export const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

export const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '600px',
    width: '100%',
};

export const heading = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '400',
    color: '#484848',
    padding: '17px 0 0',
};

export const paragraph = {
    margin: '0 0 15px',
    fontSize: '15px',
    lineHeight: '1.4',
    color: '#3c4149',
};

export const button = {
    backgroundColor: '#000000',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
};

export const buttonKickstarter = {
    ...button,
    backgroundColor: '#05CE78', // Kickstarter Green
    color: '#ffffff',
};

export const buttonGithub = {
    ...button,
    backgroundColor: '#24292e', // GitHub Black
    color: '#ffffff',
};

export const buttonWebsite = {
    ...button,
    backgroundColor: '#000000', // Default Black for website
    color: '#ffffff',
};

export const link = {
    color: '#000000',
    textDecoration: 'underline',
};

export const anchor = {
    color: '#556cd6',
};

export const hr = {
    borderColor: '#dfe1e4',
    margin: '42px 0 26px',
};

export const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
};
