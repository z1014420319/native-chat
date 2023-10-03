// import { useEffect, useRef, useState } from "react";
// import { AssistantMessage } from "./AssistantMessage";
// import { ScrollToBottom } from "./ScrollToBottom";
// import { UserMessage } from "./UserMessage";
// import { Message as VercelAiMessage } from "ai";

// export default function ChatMessages() {
//   const bottomElement = useRef<HTMLDivElement>(null);

//   const [isScrolling, setIsScrolling] = useState(false);

//   const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
//   const [lastScrollPosition, setLastScrollPosition] = useState(0);

//   useEffect(() => {
//     if (bottomElement.current) {
//       bottomElement.current.scrollIntoView();
//     }
//   }, [messages]);

//   return (
//     <section
//       className="grow overflow-auto"
//       onScroll={(e) => {
//         const target = e.target as HTMLDivElement;
//         setIsScrolling(
//           target.scrollTop + target.clientHeight < target.scrollHeight
//         );
//         setCurrentScrollPosition(target.scrollTop);
//         setTimeout(() => {
//           setLastScrollPosition(target.scrollTop);
//         }, 1000);
//       }}
//     >
//       <div className="h-16">{/* place hoder */}</div>
//       {data.map((m: VercelAiMessage) => {
//         return m.role === "user" ? (
//           <UserMessage content={m.content} key={m.id} />
//         ) : (
//           <AssistantMessage content={m.content} key={m.id} />
//         );
//       })}
//       <div className="h-56" ref={bottomElement}>
//         {/* place hoder */}
//       </div>
//       {isScrolling && <ScrollToBottom bottomElement={bottomElement.current} />}
//     </section>
//   );
// }
