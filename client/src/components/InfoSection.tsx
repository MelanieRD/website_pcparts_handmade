import React from "react";

interface InfoItem {
  icon: string;
  title: string;
  description: string;
}

interface InfoSectionProps {
  title: string;
  items: InfoItem[];
  backgroundGradient?: string;
  titleIcon?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, items, backgroundGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", titleIcon = "🛠️" }) => {
  return (
    <div
      style={{
        marginTop: "4rem",
        textAlign: "center",
        padding: "3rem",
        background: backgroundGradient,
        borderRadius: "20px",
        color: "white",
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        {titleIcon} {title}
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        {items.map((item, index) => (
          <div key={index}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              {item.icon} {item.title}
            </h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSection;
