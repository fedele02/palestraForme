export const Logo2 = ({ className = "" }) => (
  <svg 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Linea Gialla del 4 */}
     <path 
      d="M 125 90
         L 125 35 
         C 125 25, 115 20, 108 30 
         L 45 135 
         C 40 143, 45 150, 55 150 
         L 75 150 
         L 79 125 
         L 85 175 
         L 90 135 
         L 93 150 
         L 105 150 
         L 105 175 
         C 105 185, 125 185, 125 175 
         L 125 145 
         L 132 145"
      stroke="#F7E842" 
      strokeWidth="5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />

    {/* Testo ME e sottotitoli */}
    <text x="96" y="115" fill="white" fontSize="48" fontWeight="900" fontFamily="Montserrat" letterSpacing="-1">ME</text>
    <text x="96" y="128" fill="white" fontSize="9" fontWeight="700" fontFamily="Montserrat" letterSpacing="0.5">POWER FITNESS</text>
    <text x="96" y="139" fill="white" fontSize="9" fontWeight="700" fontFamily="Montserrat" letterSpacing="0.5">EXPERIENCE</text>
  </svg>
);
