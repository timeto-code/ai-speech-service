interface AudioPlayerProps {
  animate?: boolean;
  wh?: number;
}

const SoundSvg = ({ animate, wh = 24 }: AudioPlayerProps) => {
  // 预设高度数组，对应每个线条的初始高度和振幅
  const heights = [
    { initialUp: 2, initialDown: 2, amplitude: 10 },
    { initialUp: 5, initialDown: 5, amplitude: 10 },
    { initialUp: 8, initialDown: 10, amplitude: 10 },
    { initialUp: 10, initialDown: 8, amplitude: 10 },
    { initialUp: 5, initialDown: 5, amplitude: 10 },
    { initialUp: 2, initialDown: 2, amplitude: 10 },
  ];

  // const wh = 24; // Width and height of the SVG

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={wh}
      height={wh}
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: "100%",
        height: "100%",
        transform: "translate3d(0px, 0px, 0px)",
        contentVisibility: "visible",
        // backgroundColor: "black", // 背景颜色与上传的图像相匹配
        // borderRadius: "10%", // 圆形
        // padding: "2px 3px 2px 5px", // 内边距
        // border: "1px solid black", // 边框颜色为黑色
      }}
    >
      {/* ...其他SVG代码... */}
      <g transform="matrix(1,0,0,1,12,12)">
        {heights.map((height, i) => {
          const offset = i * 4 - 11; // Position offset for symmetry
          const duration = 0.75 + i * 0.1; // Varying duration
          const delay = (i * 0.2) % 1; // Varying start delay
          return (
            <path
              key={i}
              strokeLinecap="butt"
              strokeLinejoin="round"
              fillOpacity="0"
              // stroke="#e3e3e4" // 线条颜色为白色
              stroke="rgb(0,0,0)" // 线条颜色为黑色
              strokeOpacity="1"
              strokeWidth="2"
              d={`M${offset},${height.initialUp} V-${height.initialDown}`}
            >
              {animate && (
                <animate
                  attributeName="d"
                  begin={`${delay}s`} // Start delay
                  dur={`${duration}s`} // Duration of animation
                  repeatCount="indefinite"
                  values={
                    `M${offset},${2} V-${2};` +
                    `M${offset},${height.amplitude} V-${height.amplitude};` +
                    `M${offset},${2} V-${2}`
                  }
                />
              )}
            </path>
          );
        })}
      </g>
    </svg>
  );
};

export default SoundSvg;
