/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2d6064', //white background color
        secondary: '#f9f9f9', // light grey background color
        accent: '#ebf9fa', //light blue accent background color 
        pinkHeartColor: '#d24779', //pink like color
        greyHeartColor: '#bababa', // grey no like color 
        getPropertyLinkButton: '#47cad2', //get property verified button fill blue color 
        getStartedButtonColor: '#47cad2', //get started buttobn fill blue color 
        instagramIcon: '#d24779', //pink instagram logo color
        linkedinIcon: '#076ae7', //blue LinkedIn logo color
        twitterIcon: '#47cad2', //blue twitter logo color 
        textPrimary: '#030303', // black text color
        textSecondary: '#737373', //light grey text color
        textTeritary: '#212121', // price text color, near black color
        blueTextColor: '#47cad2', //turquoise font color
        webTitleFontColor: '#2d6064' //Dark blue/indago website header font color

      },
      fontFamily: {
        'abril-fatface': ['"Abril Fatface"', 'cursive'],
        'red-hat-display': ['"Red Hat Display"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};