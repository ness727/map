interface CloseButtonProps {
  isClosed: boolean;
  contentWidth: number;
  close: () => void;
}

export default function CloseButton({
  isClosed,
  contentWidth,
  close,
}: CloseButtonProps) {
  return (
    <>
      <button
        style={{
          backgroundColor: "#007BFF",
          color: "white",
          position: "absolute", // 버튼을 절대 위치로 설정
          top: "50%", // 세로 중앙에 위치
          left: (isClosed ? 0 : contentWidth) - 15, // 사이드바의 너비에 맞춰 위치 조정
          transform: "translateY(-50%)", // 버튼을 정확히 중앙에 위치시키기 위해 변환
          zIndex: 1, // 버튼이 다른 요소 위에 표시되도록 설정
          width: 30,
          height: 100,
          border: "2px solid white",
          borderRadius: 5,
          boxShadow: isClosed
            ? "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
            : "",
        }}
        onClick={close}
      >
        {isClosed ? ">>" : "<<"}
      </button>
    </>
  );
}
