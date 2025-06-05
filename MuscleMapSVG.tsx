interface MuscleMapSVGProps {
  onMuscleClick: (muscleGroup: string) => void;
  getMuscleRating: (muscleGroup: string) => number;
}

export default function MuscleMapSVG({ onMuscleClick, getMuscleRating }: MuscleMapSVGProps) {
  const getMuscleColor = (rating: number) => {
    if (rating >= 80) return "#10B981"; // Green
    if (rating >= 60) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  return (
    <div className="max-w-sm mx-auto">
      <svg
        viewBox="0 0 300 500"
        className="w-full h-auto"
        style={{ maxHeight: "600px" }}
      >
        {/* Body outline */}
        <path
          d="M150 20 
           C140 20, 130 30, 130 40
           L130 80
           C130 90, 120 100, 110 100
           L90 100
           C80 100, 70 110, 70 120
           L70 200
           C70 210, 80 220, 90 220
           L110 220
           C120 220, 130 230, 130 240
           L130 350
           C130 360, 120 370, 110 370
           L100 370
           C90 370, 80 380, 80 390
           L80 480
           C80 490, 90 500, 100 500
           L110 500
           C120 500, 130 490, 130 480
           L130 450
           L170 450
           L170 480
           C170 490, 180 500, 190 500
           L200 500
           C210 500, 220 490, 220 480
           L220 390
           C220 380, 210 370, 200 370
           L190 370
           C180 370, 170 360, 170 350
           L170 240
           C170 230, 180 220, 190 220
           L210 220
           C220 220, 230 210, 230 200
           L230 120
           C230 110, 220 100, 210 100
           L190 100
           C180 100, 170 90, 170 80
           L170 40
           C170 30, 160 20, 150 20 Z"
          fill="#E5E7EB"
          stroke="#9CA3AF"
          strokeWidth="2"
        />

        {/* Clickable muscle regions */}
        
        {/* Chest */}
        <ellipse
          cx="150"
          cy="110"
          rx="35"
          ry="25"
          fill={getMuscleColor(getMuscleRating("chest"))}
          fillOpacity="0.7"
          stroke={getMuscleColor(getMuscleRating("chest"))}
          strokeWidth="2"
          className="muscle-region cursor-pointer hover:scale-110 transition-transform"
          onClick={() => onMuscleClick("chest")}
          title="Chest"
        />

        {/* Left Arm */}
        <ellipse
          cx="95"
          cy="140"
          rx="20"
          ry="40"
          fill={getMuscleColor(getMuscleRating("arms"))}
          fillOpacity="0.7"
          stroke={getMuscleColor(getMuscleRating("arms"))}
          strokeWidth="2"
          className="muscle-region cursor-pointer hover:scale-110 transition-transform"
          onClick={() => onMuscleClick("arms")}
          title="Left Arm"
        />

        {/* Right Arm */}
        <ellipse
          cx="205"
          cy="140"
          rx="20"
          ry="40"
          fill={getMuscleColor(getMuscleRating("arms"))}
          fillOpacity="0.7"
          stroke={getMuscleColor(getMuscleRating("arms"))}
          strokeWidth="2"
          className="muscle-region cursor-pointer hover:scale-110 transition-transform"
          onClick={() => onMuscleClick("arms")}
          title="Right Arm"
        />

        {/* Core */}
        <ellipse
          cx="150"
          cy="180"
          rx="30"
          ry="35"
          fill={getMuscleColor(getMuscleRating("core"))}
          fillOpacity="0.7"
          stroke={getMuscleColor(getMuscleRating("core"))}
          strokeWidth="2"
          className="muscle-region cursor-pointer hover:scale-110 transition-transform"
          onClick={() => onMuscleClick("core")}
          title="Core"
        />

        {/* Left Leg */}
        <ellipse
          cx="125"
          cy="320"
          rx="25"
          ry="60"
          fill={getMuscleColor(getMuscleRating("legs"))}
          fillOpacity="0.7"
          stroke={getMuscleColor(getMuscleRating("legs"))}
          strokeWidth="2"
          className="muscle-region cursor-pointer hover:scale-110 transition-transform"
          onClick={() => onMuscleClick("legs")}
          title="Left Leg"
        />

        {/* Right Leg */}
        <ellipse
          cx="175"
          cy="320"
          rx="25"
          ry="60"
          fill={getMuscleColor(getMuscleRating("legs"))}
          fillOpacity="0.7"
          stroke={getMuscleColor(getMuscleRating("legs"))}
          strokeWidth="2"
          className="muscle-region cursor-pointer hover:scale-110 transition-transform"
          onClick={() => onMuscleClick("legs")}
          title="Right Leg"
        />

        {/* Shoulders */}
        <ellipse
          cx="115"
          cy="85"
          rx="15"
          ry="20"
          fill={getMuscleColor(getMuscleRating("shoulders"))}
          fillOpacity="0.7"
          stroke={getMuscleColor(getMuscleRating("shoulders"))}
          strokeWidth="2"
          className="muscle-region cursor-pointer hover:scale-110 transition-transform"
          onClick={() => onMuscleClick("shoulders")}
          title="Left Shoulder"
        />

        <ellipse
          cx="185"
          cy="85"
          rx="15"
          ry="20"
          fill={getMuscleColor(getMuscleRating("shoulders"))}
          fillOpacity="0.7"
          stroke={getMuscleColor(getMuscleRating("shoulders"))}
          strokeWidth="2"
          className="muscle-region cursor-pointer hover:scale-110 transition-transform"
          onClick={() => onMuscleClick("shoulders")}
          title="Right Shoulder"
        />

        {/* Back (simplified representation) */}
        <ellipse
          cx="150"
          cy="130"
          rx="25"
          ry="20"
          fill={getMuscleColor(getMuscleRating("back"))}
          fillOpacity="0.5"
          stroke={getMuscleColor(getMuscleRating("back"))}
          strokeWidth="2"
          strokeDasharray="5,5"
          className="muscle-region cursor-pointer hover:scale-110 transition-transform"
          onClick={() => onMuscleClick("back")}
          title="Back"
        />

        {/* Legend */}
        <g transform="translate(20, 420)">
          <text x="0" y="0" className="text-xs font-medium fill-gray-600">Strength Level:</text>
          <circle cx="0" cy="15" r="6" fill="#EF4444" />
          <text x="15" y="20" className="text-xs fill-gray-600">Weak</text>
          <circle cx="50" cy="15" r="6" fill="#F59E0B" />
          <text x="65" y="20" className="text-xs fill-gray-600">Good</text>
          <circle cx="100" cy="15" r="6" fill="#10B981" />
          <text x="115" y="20" className="text-xs fill-gray-600">Strong</text>
        </g>
      </svg>
    </div>
  );
}
