'use client';

type AlertStatus = 'success' | 'danger' | 'warning' | 'info';

export default function showCustomAlert(message: string, status: AlertStatus) {
  const colors: Record<AlertStatus, string> = {
    success: "text-green-800 bg-green-50",
    danger: "text-red-800 bg-red-50",
    warning: "text-yellow-800 bg-yellow-50",
    info: "text-blue-800 bg-blue-50",
  };

  const alertDiv = document.createElement("div");
  alertDiv.className = `p-4 mb-4 text-sm rounded-lg ${colors[status]} fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] shadow-lg animate-slideIn`;
  alertDiv.setAttribute("role", "alert");

  alertDiv.innerHTML = message;

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 2000);
};