export default {
  endOfLine: "lf", // 개행 문자: LF
  singleQuote: true, // 홑따옴표 사용
  tabWidth: 4, // 스페이스 2칸
  trailingComma: "all", // 후행 콤마 항상 사용
  printWidth: 120, // 한 줄 최대 길이: 120
  arrowParens: "always", // 화살표 함수 매개변수 괄호 항상 사용
  plugins: ["prettier-plugin-tailwindcss"], // TailwindCSS 플러그인 추가
  tailwindConfig: "./tailwind.config.js", // Tailwind 설정 파일 경로
};
