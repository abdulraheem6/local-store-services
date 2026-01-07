import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'

// // Add error boundary for production
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error('App error:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div style={{ padding: '2rem', textAlign: 'center' }}>
//           <h2>Something went wrong</h2>
//           <button onClick={() => window.location.reload()}>
//             Reload Application
//           </button>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <ErrorBoundary>
//       <App />
//     </ErrorBoundary>
//   </React.StrictMode>
// );
