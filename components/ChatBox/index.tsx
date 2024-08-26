// import { ChatToggle, ChatCloseIcon, ChatEntry } from "@livekit/components-react";
// import React from "react";


// const CustomChat = () => {
//     return (
//         <>
//         <div {...props} className="lk-chat">
//           <div className="lk-chat-header">
//             Messages
//             <ChatToggle className="lk-close-button">
//               <ChatCloseIcon />
//             </ChatToggle>
//           </div>
    
//           <ul className="lk-list lk-chat-messages" ref={ulRef}>
//             {props.children
//               ? chatMessages.map((msg:any, idx:any) =>
//                   cloneSingleChild(props.children, {
//                     entry: msg,
//                     key: msg.id ?? idx,
//                     messageFormatter,
//                   }),
//                 )
//               : chatMessages.map((msg:any, idx:any, allMsg:any) => {
//                   const hideName = idx >= 1 && allMsg[idx - 1].from === msg.from;
//                   // If the time delta between two messages is bigger than 60s show timestamp.
//                   const hideTimestamp = idx >= 1 && msg.timestamp - allMsg[idx - 1].timestamp < 60_000;
    
//                   return (
//                     <ChatEntry
//                       key={msg.id ?? idx}
//                       hideName={hideName}
//                       hideTimestamp={hideName === false ? false : hideTimestamp} // If we show the name always show the timestamp as well.
//                       entry={msg}
//                       messageFormatter={messageFormatter}
//                     />
//                   );
//                 })}
//           </ul>
//           <form className="lk-chat-form" onSubmit={handleSubmit}>
//             <input
//               className="lk-form-control lk-chat-form-input"
//               disabled={isSending}
//               ref={inputRef}
//               type="text"
//               placeholder="Enter a message..."
//               onInput={(ev) => ev.stopPropagation()}
//               onKeyDown={(ev) => ev.stopPropagation()}
//               onKeyUp={(ev) => ev.stopPropagation()}
//             />
//             <button type="submit" className="lk-button lk-chat-form-button" disabled={isSending}>
//               Send
//             </button>
//           </form>
//         </div>
//         </>
//       );
// };

// export default CustomChat;
