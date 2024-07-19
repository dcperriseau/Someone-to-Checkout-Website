/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '800px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      spacing: {
        '3p': '10.7%', // Define custom spacing values
      },
      colors: {
        primary: '#2d6064', // white background color
        secondary: '#f9f9f9', // light grey background color
        accent: '#ebf9fa', // light blue accent background color 
        pinkHeartColor: '#d24779', // pink like color
        greyHeartColor: '#bababa', // grey no like color 
        getPropertyLinkButton: '#47cad2', // get property verified button fill blue color 
        getStartedButtonColor: '#47cad2', // get started button fill blue color 
        instagramIcon: '#d24779', // pink Instagram logo color
        linkedinIcon: '#076ae7', // blue LinkedIn logo color
        twitterIcon: '#47cad2', // blue Twitter logo color 
        textPrimary: '#030303', // black text color
        textSecondary: '#737373', // light grey text color
        textTeritary: '#212121', // price text color, near black color
        blueTextColor: '#47cad2', // turquoise font color
        webTitleFontColor: '#2d6064', // dark blue/indigo website header font color
        bubbleIconColor: '#ebf9fa', // light blue color for bubble icon 
        black: '#212121',
        borderGrey: '#ededed', // Custom grey border color
      },
      fontFamily: {
        'abril-fatface': ['"Abril Fatface"', 'cursive'],
        'red-hat-display': ['"Red Hat Display"', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      fontSize: {
        '32px' : ['32px', '42px'], // font size and line height for footer "Someone To Check Out"
        '40px' : ['40px', '52px'], // font size and line height for Contact Us page Title
        '20px': ['20px', '28px'],
        '16px': ['16px', '24px'],
      },
      lineHeight: {
        '22px': '22px',
      },
      boxShadow: {
        'custom-light': '0px 2px 8px rgba(0,0,0,0.12)', // custom shadowing for picture 
      },
      fontWeight: {
        extrabold: '800',
      },
    },
  },
  plugins: [],
};
