//  import { motion } from "framer-motion";
//  export function CircuitSVG({ running, highlights, fluidType, duration, style }) {
//   const is = (part) => highlights.includes(part) || highlights.includes("all");
//   const dim = (part) => (is(part) ? 1 : 0.25);

//   // رنگ کیسه و جریان بر اساس نوع محلول
//   const fluidColor = fluidType === "NS" ? "#d1fae5"
//                     : fluidType === "PC" ? "#ef4444"
//                     : "#fde68a"; // FFP و Alb زرد

//   return (
//     <svg viewBox="0 0 800 500" className="w-full h-auto" style={style}>
//       <rect x={20} y={50} width={760} height={400} rx={20} fill="#f8fafc" stroke="#e6eef6" />

//       {/* Fluid Bag */}
//       <g transform="translate(620,0)">
//         <rect x={20} y={20} width={60} height={100} rx={12} fill="#fff" stroke="#cbd5e1" opacity={dim("saline")} />
//         <rect x={25} y={25} width={50} height={70} rx={8} fill={fluidColor} opacity={dim("saline")} />
//         <text x={25 + 50/2} y={25 + 70/2} fontSize={11} fill="#064e3b" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
//           {fluidType === "NS" ? "N/S 0.9%" : fluidType === "FFP" ? "FFP" : fluidType === "Alb" ? "Albumin" : "Packed Cell"}
//         </text>
//         <line x1={50} y1={120} x2={50} y2={180} stroke={fluidColor} strokeWidth={4} opacity={dim("saline")} />
//       </g>

//       {/* Arterial line */}
//       <line x1={670} y1={180} x2={300} y2={180} stroke={fluidColor} strokeWidth={6} opacity={dim("arterial")} />
//       <line x1={670} y1={180} x2={300} y2={180} stroke={fluidColor} strokeWidth={2} strokeDasharray="6 8"
//         style={{ opacity: running ? 1 : 0.2, animation: "flowDash var(--flow-duration) linear infinite" }}
//       />

//       {/* Pump */}
//       <g transform="translate(250,150)">
//         <rect x={0} y={0} width={80} height={60} rx={8} fill="#fff" stroke="#cbd5e1" opacity={dim("pump")} />
//         <motion.circle cx={40} cy={30} r={8} fill="#0ea5e9"
//           animate={running ? { rotate: 360 } : { rotate: 0 }}
//           transition={{ loop: Infinity, ease: "linear", duration: running ? 0.6 : 0 }}
//         />
//         <text x={20} y={55} fontSize={10} fill="#334155">Pump</text>
//       </g>

//       {/* Dialyzer */}
//       <g transform="translate(420,100)">
//         <rect x={0} y={0} width={70} height={180} rx={10} fill="#fff" stroke="#94a3b8" opacity={dim("dialyzer")} />
//         <rect x={15} y={10} width={10} height={160} rx={5} fill="#fef3c7"
//           style={{ opacity: running ? 0.9 : 0.2, animation: "verticalFlow var(--flow-duration) linear infinite" }}
//         />
//         <text x={5} y={100} fontSize={12} fill="#0f172a">Dialyzer</text>
//       </g>

//       {/* Venous line */}
//       <line x1={490} y1={280} x2={200} y2={280} stroke={fluidColor} strokeWidth={6} opacity={dim("venous")} />
//       <line x1={490} y1={280} x2={200} y2={280} stroke={fluidColor} strokeWidth={2} strokeDasharray="6 8"
//         style={{ opacity: running ? 1 : 0.2, animation: "flowDash var(--flow-duration) linear infinite reverse" }}
//       />

//       {/* Venous chamber */}
//       <rect x={150} y={260} width={40} height={60} rx={8} fill="#fff" stroke="#cbd5e1" opacity={dim("venous")} />
//       <text x={152} y={300} fontSize={10} fill="#2563eb">Ven</text>
//     </svg>
//   );
// }