const BrainFlowerSvg = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Brain outline */}
    <path
      d="M100 30c-20 0-35 10-42 25-8 2-15 10-17 20-3 12 2 24 12 30-2 8 0 18 8 24 6 5 14 7 22 5 5 10 15 16 27 16s22-6 27-16c8 2 16 0 22-5 8-6 10-16 8-24 10-6 15-18 12-30-2-10-9-18-17-20-7-15-22-25-42-25z"
      stroke="hsl(168, 62%, 58%)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Brain fold lines */}
    <path d="M100 45v35M85 55c10 5 20 5 30 0M80 80c13 8 27 8 40 0" stroke="hsl(168, 62%, 58%)" strokeWidth="1" opacity="0.6" />
    {/* Flowers */}
    <circle cx="55" cy="40" r="8" fill="hsl(39, 91%, 55%)" opacity="0.7" />
    <circle cx="55" cy="40" r="3" fill="hsl(4, 80%, 63%)" opacity="0.8" />
    <circle cx="145" cy="45" r="6" fill="hsl(39, 91%, 55%)" opacity="0.5" />
    <circle cx="145" cy="45" r="2.5" fill="hsl(4, 80%, 63%)" opacity="0.7" />
    <circle cx="40" cy="100" r="7" fill="hsl(168, 62%, 58%)" opacity="0.4" />
    <circle cx="160" cy="95" r="5" fill="hsl(168, 62%, 58%)" opacity="0.3" />
    {/* Small decorative dots */}
    <circle cx="70" cy="35" r="2" fill="hsl(39, 91%, 55%)" opacity="0.5" />
    <circle cx="130" cy="38" r="2" fill="hsl(39, 91%, 55%)" opacity="0.4" />
    <circle cx="50" cy="70" r="1.5" fill="hsl(168, 62%, 58%)" opacity="0.5" />
    <circle cx="150" cy="72" r="1.5" fill="hsl(168, 62%, 58%)" opacity="0.4" />
    {/* Leaf/stem lines */}
    <path d="M55 48v15M145 53v12M40 108v10" stroke="hsl(168, 62%, 58%)" strokeWidth="1" opacity="0.4" />
  </svg>
);

export default BrainFlowerSvg;
