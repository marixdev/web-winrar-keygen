/**
 * Translations for the "How It Works" page.
 * Separated from main i18n to keep things manageable.
 */
// LangCode keys match the main i18n module

export interface HiwTranslation {
  hiwTitle: string;
  hiwSubtitle: string;
  hiwFlowUser: string;
  hiwFlowKey: string;
  hiwFlowSign: string;
  // S1
  hiwS1Title: string;
  hiwS1P1: string;
  hiwS1KeyPoint: string;
  hiwS1P2: string;
  hiwS1FlowTitle: string;
  // S2
  hiwS2Title: string;
  hiwS2P1: string;
  hiwS2Example: string;
  hiwS2P2: string;
  hiwS2Op: string;
  hiwS2Rule: string;
  hiwS2VD: string;
  hiwS2Add: string;
  hiwS2Mul: string;
  hiwS2P3: string;
  // S3
  hiwS3Title: string;
  hiwS3P1: string;
  hiwS3Elements: string;
  hiwS3P2: string;
  hiwS3HowMul: string;
  hiwS3P3: string;
  hiwS3SpeedTrick: string;
  hiwS3P4: string;
  // S4
  hiwS4Title: string;
  hiwS4P1: string;
  hiwS4P2: string;
  hiwS4P3: string;
  hiwS4OpCol: string;
  hiwS4HowCol: string;
  hiwS4AddHow: string;
  hiwS4MulHow: string;
  hiwS4Sq: string;
  hiwS4SqHow: string;
  hiwS4Inv: string;
  hiwS4InvHow: string;
  hiwS4Convert: string;
  hiwS4P4: string;
  hiwS4ConvertExample: string;
  // S5
  hiwS5Title: string;
  hiwS5P1: string;
  hiwS5Params: string;
  hiwS5Param: string;
  hiwS5Value: string;
  hiwS5Field: string;
  hiwS5BasePoint: string;
  hiwS5P2: string;
  hiwS5BasePointCoords: string;
  hiwS5Order: string;
  hiwS5P3: string;
  hiwS5P4: string;
  hiwS5P5: string;
  hiwS5PointAdd: string;
  hiwS5DoubleAdd: string;
  // S6
  hiwS6Title: string;
  hiwS6P1: string;
  hiwS6Diff: string;
  hiwS6P2: string;
  hiwS6Output: string;
  hiwS6Method: string;
  hiwS6NormalConcat: string;
  hiwS6ExtraHash: string;
  hiwS6P3: string;
  hiwS6FixedValues: string;
  // S7
  hiwS7Title: string;
  hiwS7Notation: string;
  hiwS7Symbol: string;
  hiwS7Meaning: string;
  hiwS7PrivKey: string;
  hiwS7PubKey: string;
  hiwS7Hash: string;
  hiwS7OrderG: string;
  hiwS7Process: string;
  hiwS7Step1: string;
  hiwS7Step2: string;
  hiwS7Step3: string;
  hiwS7Step4: string;
  hiwS7Compare: string;
  // S8
  hiwS8Title: string;
  hiwS8P1: string;
  hiwS8Step1: string;
  hiwS8Step2: string;
  hiwS8Step3: string;
  hiwS8Step4: string;
  hiwS8Warning: string;
  hiwS8P2: string;
  // S9
  hiwS9Title: string;
  hiwS9P1: string;
  hiwS9PrivKey: string;
  hiwS9Why: string;
  hiwS9P2: string;
  // S10
  hiwS10Title: string;
  hiwS10P1: string;
  hiwS10Step1: string;
  hiwS10Step2: string;
  hiwS10Step3: string;
  hiwS10Step4: string;
  hiwS10Step5: string;
  hiwS10Step6: string;
  hiwS10Step7: string;
  hiwS10Output: string;
  // S11
  hiwS11Title: string;
  hiwS11Component: string;
  hiwS11Desc: string;
  hiwS11Field: string;
  hiwS11Curve: string;
  hiwS11BasePoint: string;
  hiwS11BasePointV: string;
  hiwS11OrderN: string;
  hiwS11FixedSeed: string;
  hiwS11Variant: string;
  hiwS11Sig: string;
  hiwS11Why: string;
  hiwS11Reason1: string;
  hiwS11Reason2: string;
  hiwS11Reason3: string;
  // S12
  hiwS12Title: string;
  hiwS12En: string;
  hiwS12Local: string;
  hiwS12Explain: string;
  hiwS12GF: string;
  hiwS12GFDesc: string;
  hiwS12Irr: string;
  hiwS12IrrDesc: string;
  hiwS12EC: string;
  hiwS12ECDesc: string;
  hiwS12BP: string;
  hiwS12BPDesc: string;
  hiwS12PK: string;
  hiwS12PKDesc: string;
  hiwS12PubK: string;
  hiwS12PubKDesc: string;
  hiwS12DS: string;
  hiwS12DSDesc: string;
  hiwS12XOR: string;
  hiwS12XORDesc: string;
  hiwS12SM2: string;
  hiwS12SM2Desc: string;
}

// ======================
// ENGLISH
// ======================
const en: HiwTranslation = {
  hiwTitle: "How Does WinRAR Keygen Work?",
  hiwSubtitle: "A detailed explanation of the ECC-based signature algorithm used to generate rarreg.key",
  hiwFlowUser: "Username",
  hiwFlowKey: "Generate Key",
  hiwFlowSign: "ECC Sign",
  hiwS1Title: "Overview",
  hiwS1P1: "WinRAR uses an ECC (Elliptic Curve Cryptography) digital signature algorithm to generate the license file rarreg.key. Specifically, it uses a custom variant of the SM2 elliptic curve digital signature scheme.",
  hiwS1KeyPoint: "Key Difference",
  hiwS1P2: "Instead of using a curve over a prime field (like Bitcoin or TLS), WinRAR uses a curve over a composite field GF((2¹⁵)¹⁷) — a binary Galois field.",
  hiwS1FlowTitle: "Process Flow",
  hiwS2Title: "What is a Galois Field?",
  hiwS2P1: "A Galois Field (or finite field) is a set of numbers with a fixed size where you can perform addition, subtraction, multiplication, and division, and the result always stays within the set.",
  hiwS2Example: "Simplest Example: GF(2)",
  hiwS2P2: "GF(2) has only 2 elements: 0 and 1. Operations work like logic gates:",
  hiwS2Op: "Operation",
  hiwS2Rule: "Rule",
  hiwS2VD: "Examples",
  hiwS2Add: "Addition",
  hiwS2Mul: "Multiplication",
  hiwS2P3: "In cryptography, Galois fields enable fast computation (using XOR), bounded results (no overflow), and every non-zero element has an inverse (division is possible).",
  hiwS3Title: "Ground Field GF(2¹⁵)",
  hiwS3P1: "GF(2¹⁵) is a Galois field with 32,768 elements. Each element is a 15-bit number (0x0000 to 0x7FFF), represented as a polynomial of degree ≤ 14 with binary coefficients.",
  hiwS3Elements: "elements",
  hiwS3P2: "To keep multiplication results within 15 bits, we perform modular reduction using an irreducible polynomial:",
  hiwS3HowMul: "How Multiplication Works",
  hiwS3P3: "When the multiplication result exceeds 15 bits, XOR with the irreducible polynomial to reduce it back:",
  hiwS3SpeedTrick: "Speed Optimization",
  hiwS3P4: "The code uses log/exp lookup tables for fast multiplication, similar to logarithm tables in traditional math:",
  hiwS4Title: "Composite Field GF((2¹⁵)¹⁷)",
  hiwS4P1: "This is a degree-17 extension over the ground field GF(2¹⁵). Each element is a polynomial of degree ≤ 16 where each coefficient is an element of GF(2¹⁵).",
  hiwS4P2: "Total size: 15 × 17 = 255 bits per element.",
  hiwS4P3: "The irreducible polynomial for the extension field:",
  hiwS4OpCol: "Operation",
  hiwS4HowCol: "Method",
  hiwS4AddHow: "XOR each coefficient",
  hiwS4MulHow: "Schoolbook polynomial multiplication + modular reduction",
  hiwS4Sq: "Square",
  hiwS4SqHow: "Special case of multiplication (faster)",
  hiwS4Inv: "Inverse",
  hiwS4InvHow: "Extended Euclidean algorithm",
  hiwS4Convert: "Integer ↔ Field Conversion",
  hiwS4P4: "An element with 17 coefficients (each 15-bit) maps to a 255-bit integer by concatenation:",
  hiwS4ConvertExample: "Example",
  hiwS5Title: "Elliptic Curve (ECC)",
  hiwS5P1: "An elliptic curve is a mathematical curve with a special structure. Points on this curve form an algebraic group — the foundation of ECC cryptography.",
  hiwS5Params: "Curve Parameters",
  hiwS5Param: "Parameter",
  hiwS5Value: "Value",
  hiwS5Field: "Field",
  hiwS5BasePoint: "Base Point G",
  hiwS5P2: "A fixed point on the curve used as the origin for all computations:",
  hiwS5BasePointCoords: "Coordinates",
  hiwS5Order: "Order n",
  hiwS5P3: "The order n of point G is the smallest integer such that n·G = O (point at infinity).",
  hiwS5P4: "n has 241 bits. This means adding G to itself n times returns to the starting point (infinity).",
  hiwS5P5: "k·G means \"add G to itself k times\". The code uses the double-and-add method (similar to square-and-multiply):",
  hiwS5PointAdd: "Point Addition",
  hiwS5DoubleAdd: "Double-and-Add Example",
  hiwS6Title: "WinRAR's SHA-1 Hash",
  hiwS6P1: "Standard SHA-1 takes arbitrary input and produces a 160-bit (20-byte) hash with 5 state values of 32 bits each.",
  hiwS6Diff: "WinRAR Does It Differently",
  hiwS6P2: "WinRAR doesn't concatenate the 5 state values normally. Instead, it computes a big integer and appends 5 fixed values:",
  hiwS6Output: "Output Size",
  hiwS6Method: "Method",
  hiwS6NormalConcat: "Concatenate 5 states",
  hiwS6ExtraHash: "5 states + 5 fixed values → 240-bit",
  hiwS6P3: "The final result is a 240-bit integer (first 15 × 16-bit words) used for the signing algorithm.",
  hiwS6FixedValues: "Fixed Appended Values",
  hiwS7Title: "ECC Digital Signature",
  hiwS7Notation: "Notation",
  hiwS7Symbol: "Symbol",
  hiwS7Meaning: "Meaning",
  hiwS7PrivKey: "Private key (secret integer)",
  hiwS7PubKey: "Public key (point on curve)",
  hiwS7Hash: "Hash of data to sign",
  hiwS7OrderG: "Order of base point G",
  hiwS7Process: "Signing Process",
  hiwS7Step1: "Generate random integer Rnd where 1 ≤ Rnd < n",
  hiwS7Step2: "Compute r: multiply G by Rnd, take X coordinate, add hash h, mod n",
  hiwS7Step3: "Compute s: subtract (private key × r) from Rnd, mod n",
  hiwS7Step4: "Output signature pair (r, s)",
  hiwS7Compare: "Comparison with Standard ECDSA",
  hiwS8Title: "Private Key Generation",
  hiwS8P1: "WinRAR generates private keys from input data using SHA-1 in a deterministic process:",
  hiwS8Step1: "Initialize array of 6 × 32-bit integers [g₀, g₁, g₂, g₃, g₄, g₅]",
  hiwS8Step2: "If input is empty → use fixed seed values; otherwise SHA-1(input) → g₁...g₅",
  hiwS8Step3: "Loop 15 times: increment counter g₀, SHA-1 the array, take lowest 16 bits",
  hiwS8Step4: "Concatenate 15 × 16-bit values → 240-bit private key",
  hiwS8Warning: "Security Implication",
  hiwS8P2: "With empty input, the seed is fixed → the private key is always the same. Anyone who reverse-engineers the algorithm can reproduce it.",
  hiwS9Title: "WinRAR's Keys",
  hiwS9P1: "WinRAR has a fixed private key generated with empty input (l = 0):",
  hiwS9PrivKey: "Private Key",
  hiwS9Why: "Why Is the Key Known?",
  hiwS9P2: "The private key is generated by a deterministic algorithm with fixed input. Anyone who analyzes the code can reproduce it — this is the design weakness.",
  hiwS10Title: "Generating rarreg.key",
  hiwS10P1: "Input: Username (e.g. \"wrkg\") and License Type (e.g. \"Single PC usage license\")",
  hiwS10Step1: "Generate public key from Username → compress in SM2 format → 64 hex chars (Temp)",
  hiwS10Step2: "Create Items[3] = \"60\" + first 48 chars of Temp",
  hiwS10Step3: "Create Items[0] = SM2Compress(GeneratePublicKey(GeneratePrivateKey(Items[3])))",
  hiwS10Step4: "Create UID = last 16 chars of Temp + first 4 chars of Items[0]",
  hiwS10Step5: "Sign License Type with WinRAR's fixed private key → Items[1]",
  hiwS10Step6: "Sign (Username + Items[0]) with fixed private key → Items[2]",
  hiwS10Step7: "Compute CRC32 checksum → assemble Data → output file with 54 chars per line",
  hiwS10Output: "Output Format",
  hiwS11Title: "Summary",
  hiwS11Component: "Component",
  hiwS11Desc: "Description",
  hiwS11Field: "Field",
  hiwS11Curve: "Curve",
  hiwS11BasePoint: "Base Point",
  hiwS11BasePointV: "Fixed (255-bit X, 255-bit Y)",
  hiwS11OrderN: "Order n",
  hiwS11FixedSeed: "from fixed seed",
  hiwS11Variant: "variant",
  hiwS11Sig: "Signature",
  hiwS11Why: "Why Does This Keygen Work?",
  hiwS11Reason1: "WinRAR embeds the key generation algorithm — with empty input, the private key is always fixed",
  hiwS11Reason2: "The ECC signature is valid — because it's signed with the correct private key",
  hiwS11Reason3: "WinRAR only checks the signature — if valid with the known public key → license is valid",
  hiwS12Title: "Glossary",
  hiwS12En: "English",
  hiwS12Local: "Local Term",
  hiwS12Explain: "Explanation",
  hiwS12GF: "Galois Field",
  hiwS12GFDesc: "Finite set with 4 operations (add/sub/mul/div)",
  hiwS12Irr: "Irreducible Polynomial",
  hiwS12IrrDesc: "Cannot be factored, used for modular reduction",
  hiwS12EC: "Elliptic Curve",
  hiwS12ECDesc: "Mathematical curve used in cryptography",
  hiwS12BP: "Base Point",
  hiwS12BPDesc: "Fixed point on curve, origin of computation",
  hiwS12PK: "Private Key",
  hiwS12PKDesc: "Secret number used for signing",
  hiwS12PubK: "Public Key",
  hiwS12PubKDesc: "Point on curve, P = k × G",
  hiwS12DS: "Digital Signature",
  hiwS12DSDesc: "Authentication proof, pair (r, s)",
  hiwS12XOR: "XOR",
  hiwS12XORDesc: "Addition in binary fields",
  hiwS12SM2: "SM2",
  hiwS12SM2Desc: "ECC-based digital signature standard",
};

// ======================
// VIETNAMESE
// ======================
const vi: HiwTranslation = {
  hiwTitle: "WinRAR Keygen hoạt động như thế nào?",
  hiwSubtitle: "Giải thích chi tiết thuật toán chữ ký số ECC dùng để tạo file rarreg.key",
  hiwFlowUser: "Tên người dùng",
  hiwFlowKey: "Tạo khóa",
  hiwFlowSign: "Ký ECC",
  hiwS1Title: "Tổng quan",
  hiwS1P1: "WinRAR sử dụng thuật toán chữ ký số dựa trên đường cong Elliptic (ECC) để tạo file license rarreg.key. Cụ thể, nó dùng một biến thể tùy chỉnh của lược đồ chữ ký số SM2 trên đường cong Elliptic.",
  hiwS1KeyPoint: "Điểm đặc biệt",
  hiwS1P2: "Thay vì dùng đường cong trên trường số nguyên tố (như Bitcoin hay TLS), WinRAR chọn đường cong trên trường hợp thành GF((2¹⁵)¹⁷) — một trường Galois nhị phân.",
  hiwS1FlowTitle: "Luồng xử lý",
  hiwS2Title: "Trường Galois là gì?",
  hiwS2P1: "Trường Galois (hay trường hữu hạn) là một tập hợp số có giới hạn, trong đó bạn có thể thực hiện phép cộng, trừ, nhân, chia mà kết quả luôn nằm trong tập đó.",
  hiwS2Example: "Ví dụ đơn giản nhất: GF(2)",
  hiwS2P2: "GF(2) chỉ có 2 phần tử: 0 và 1. Các phép toán giống cổng logic:",
  hiwS2Op: "Phép toán",
  hiwS2Rule: "Quy tắc",
  hiwS2VD: "Ví dụ",
  hiwS2Add: "Cộng",
  hiwS2Mul: "Nhân",
  hiwS2P3: "Trong mật mã học, trường Galois cho phép tính toán nhanh (dùng XOR), kết quả không bị tràn, và mọi phần tử khác 0 đều có nghịch đảo (chia được).",
  hiwS3Title: "Trường cơ sở GF(2¹⁵)",
  hiwS3P1: "GF(2¹⁵) là trường Galois có 32.768 phần tử. Mỗi phần tử là một số 15-bit (0x0000 đến 0x7FFF), biểu diễn dạng đa thức bậc ≤ 14 với hệ số nhị phân.",
  hiwS3Elements: "phần tử",
  hiwS3P2: "Để phép nhân không tràn ra ngoài 15 bit, ta chia lấy dư cho đa thức bất khả quy:",
  hiwS3HowMul: "Phép nhân hoạt động thế nào",
  hiwS3P3: "Khi kết quả nhân vượt quá 15 bit, XOR với đa thức bất khả quy để rút gọn:",
  hiwS3SpeedTrick: "Tối ưu tốc độ",
  hiwS3P4: "Code dùng bảng logarit/mũ (Log/Exp table) để nhân nhanh, giống bảng logarit trong toán phổ thông:",
  hiwS4Title: "Trường mở rộng GF((2¹⁵)¹⁷)",
  hiwS4P1: "Đây là trường mở rộng bậc 17 trên cơ sở GF(2¹⁵). Mỗi phần tử là đa thức bậc ≤ 16 mà mỗi hệ số thuộc GF(2¹⁵).",
  hiwS4P2: "Kích thước tổng: 15 × 17 = 255 bit mỗi phần tử.",
  hiwS4P3: "Đa thức bất khả quy của trường mở rộng:",
  hiwS4OpCol: "Phép toán",
  hiwS4HowCol: "Cách thực hiện",
  hiwS4AddHow: "XOR từng hệ số",
  hiwS4MulHow: "Nhân đa thức schoolbook + rút gọn modular",
  hiwS4Sq: "Bình phương",
  hiwS4SqHow: "Trường hợp đặc biệt của nhân (nhanh hơn)",
  hiwS4Inv: "Nghịch đảo",
  hiwS4InvHow: "Thuật toán Euclid mở rộng",
  hiwS4Convert: "Chuyển đổi: Số nguyên ↔ Phần tử trường",
  hiwS4P4: "Một phần tử có 17 hệ số (mỗi cái 15-bit) được ghép thành số nguyên 255-bit:",
  hiwS4ConvertExample: "Ví dụ",
  hiwS5Title: "Đường cong Elliptic (ECC)",
  hiwS5P1: "Đường cong Elliptic là đường cong toán học có cấu trúc đặc biệt. Các điểm trên đường cong tạo thành nhóm đại số — nền tảng mật mã ECC.",
  hiwS5Params: "Tham số đường cong",
  hiwS5Param: "Tham số",
  hiwS5Value: "Giá trị",
  hiwS5Field: "Trường",
  hiwS5BasePoint: "Điểm cơ sở G",
  hiwS5P2: "Điểm cố định trên đường cong, dùng làm gốc cho mọi phép tính:",
  hiwS5BasePointCoords: "Tọa độ",
  hiwS5Order: "Bậc n (Order)",
  hiwS5P3: "Bậc n của điểm G là số nguyên nhỏ nhất sao cho n·G = O (điểm vô cực).",
  hiwS5P4: "n có 241 bit. Nghĩa là \"cộng\" G với chính nó n lần sẽ quay về điểm bắt đầu.",
  hiwS5P5: "k·G nghĩa là \"cộng G k lần\". Code dùng phương pháp double-and-add (nhân đôi và cộng):",
  hiwS5PointAdd: "Phép cộng điểm",
  hiwS5DoubleAdd: "Ví dụ Double-and-Add",
  hiwS6Title: "Hash SHA-1 của WinRAR",
  hiwS6P1: "SHA-1 chuẩn nhận đầu vào bất kỳ, cho ra 160-bit (20 byte) hash với 5 giá trị trạng thái, mỗi cái 32-bit.",
  hiwS6Diff: "WinRAR làm khác",
  hiwS6P2: "WinRAR KHÔNG ghép nối 5 state bình thường. Thay vào đó, nó tính số nguyên lớn rồi thêm 5 giá trị cố định:",
  hiwS6Output: "Kích thước đầu ra",
  hiwS6Method: "Phương pháp",
  hiwS6NormalConcat: "Ghép nối 5 state",
  hiwS6ExtraHash: "5 state + 5 giá trị cố định → 240-bit",
  hiwS6P3: "Kết quả cuối cùng là số nguyên 240-bit (lấy 15 × 16-bit đầu), dùng cho thuật toán ký.",
  hiwS6FixedValues: "Giá trị cố định được thêm vào",
  hiwS7Title: "Thuật toán chữ ký số ECC",
  hiwS7Notation: "Ký hiệu",
  hiwS7Symbol: "Ký hiệu",
  hiwS7Meaning: "Ý nghĩa",
  hiwS7PrivKey: "Khóa riêng (số nguyên bí mật)",
  hiwS7PubKey: "Khóa công khai (điểm trên đường cong)",
  hiwS7Hash: "Hash của dữ liệu cần ký",
  hiwS7OrderG: "Bậc của điểm G",
  hiwS7Process: "Quy trình ký",
  hiwS7Step1: "Tạo số ngẫu nhiên Rnd sao cho 1 ≤ Rnd < n",
  hiwS7Step2: "Tính r: nhân G với Rnd, lấy tọa độ X, cộng hash h, mod n",
  hiwS7Step3: "Tính s: lấy Rnd trừ (khóa riêng × r), mod n",
  hiwS7Step4: "Xuất chữ ký cặp (r, s)",
  hiwS7Compare: "So sánh với ECDSA chuẩn",
  hiwS8Title: "Thuật toán tạo khóa riêng",
  hiwS8P1: "WinRAR tạo khóa riêng từ dữ liệu đầu vào bằng SHA-1 theo quy trình xác định:",
  hiwS8Step1: "Khởi tạo mảng 6 × 32-bit: [g₀, g₁, g₂, g₃, g₄, g₅]",
  hiwS8Step2: "Nếu đầu vào rỗng → dùng seed cố định; ngược lại SHA-1(input) → g₁...g₅",
  hiwS8Step3: "Lặp 15 lần: tăng bộ đếm g₀, SHA-1 mảng, lấy 16 bit thấp nhất",
  hiwS8Step4: "Ghép 15 × 16-bit → khóa riêng 240-bit",
  hiwS8Warning: "Hệ quả bảo mật",
  hiwS8P2: "Với đầu vào rỗng, seed cố định → khóa riêng luôn giống nhau. Bất kỳ ai phân tích code đều có thể tái tạo.",
  hiwS9Title: "Khóa của WinRAR",
  hiwS9P1: "WinRAR có khóa riêng cố định, sinh với đầu vào rỗng (l = 0):",
  hiwS9PrivKey: "Khóa riêng",
  hiwS9Why: "Tại sao biết được khóa?",
  hiwS9P2: "Khóa riêng sinh bằng thuật toán xác định với đầu vào cố định. Ai phân tích code cũng tái tạo được — đây là điểm yếu thiết kế.",
  hiwS10Title: "Quy trình tạo rarreg.key",
  hiwS10P1: "Đầu vào: Tên người dùng (vd: \"wrkg\") và Loại giấy phép (vd: \"Single PC usage license\")",
  hiwS10Step1: "Tạo Public Key từ Username → nén SM2 → 64 hex chars (Temp)",
  hiwS10Step2: "Tạo Items[3] = \"60\" + 48 ký tự đầu của Temp",
  hiwS10Step3: "Tạo Items[0] = SM2Compress(GeneratePublicKey(GeneratePrivateKey(Items[3])))",
  hiwS10Step4: "Tạo UID = 16 ký tự cuối Temp + 4 ký tự đầu Items[0]",
  hiwS10Step5: "Ký License Type bằng khóa riêng cố định → Items[1]",
  hiwS10Step6: "Ký (Username + Items[0]) bằng khóa riêng cố định → Items[2]",
  hiwS10Step7: "Tính CRC32 checksum → ghép Data → xuất file 54 ký tự/dòng",
  hiwS10Output: "Định dạng đầu ra",
  hiwS11Title: "Tóm tắt",
  hiwS11Component: "Thành phần",
  hiwS11Desc: "Mô tả",
  hiwS11Field: "Trường",
  hiwS11Curve: "Đường cong",
  hiwS11BasePoint: "Điểm cơ sở",
  hiwS11BasePointV: "Cố định (255-bit X, 255-bit Y)",
  hiwS11OrderN: "Bậc n",
  hiwS11FixedSeed: "từ seed cố định",
  hiwS11Variant: "biến thể",
  hiwS11Sig: "Chữ ký",
  hiwS11Why: "Tại sao keygen này hoạt động?",
  hiwS11Reason1: "WinRAR nhúng thuật toán sinh khóa — với đầu vào rỗng, khóa riêng luôn cố định",
  hiwS11Reason2: "Chữ ký ECC hợp lệ — vì được ký bằng đúng khóa riêng",
  hiwS11Reason3: "WinRAR chỉ kiểm tra chữ ký — nếu hợp lệ với public key đã biết → license hợp lệ",
  hiwS12Title: "Bảng thuật ngữ",
  hiwS12En: "Tiếng Anh",
  hiwS12Local: "Tiếng Việt",
  hiwS12Explain: "Giải thích",
  hiwS12GF: "Trường Galois",
  hiwS12GFDesc: "Tập hợp số giới hạn có đủ 4 phép tính",
  hiwS12Irr: "Đa thức bất khả quy",
  hiwS12IrrDesc: "Không thể phân tích, dùng để chia dư",
  hiwS12EC: "Đường cong Elliptic",
  hiwS12ECDesc: "Đường cong toán học dùng trong mật mã",
  hiwS12BP: "Điểm cơ sở",
  hiwS12BPDesc: "Điểm cố định trên đường cong, gốc tính toán",
  hiwS12PK: "Khóa riêng",
  hiwS12PKDesc: "Số bí mật, dùng để ký",
  hiwS12PubK: "Khóa công khai",
  hiwS12PubKDesc: "Điểm trên đường cong, P = k × G",
  hiwS12DS: "Chữ ký số",
  hiwS12DSDesc: "Bằng chứng xác thực, cặp (r, s)",
  hiwS12XOR: "Phép XOR",
  hiwS12XORDesc: "Cộng trong trường nhị phân",
  hiwS12SM2: "SM2",
  hiwS12SM2Desc: "Tiêu chuẩn chữ ký số dựa trên ECC",
};

// ======================
// Helper to create translations that fall back to English
// ======================
function t(overrides: Partial<HiwTranslation>): HiwTranslation {
  return { ...en, ...overrides };
}

const id = t({
  hiwTitle: "Bagaimana WinRAR Keygen Bekerja?",
  hiwSubtitle: "Penjelasan detail algoritma tanda tangan ECC untuk menghasilkan rarreg.key",
  hiwFlowUser: "Nama Pengguna",
  hiwFlowKey: "Buat Kunci",
  hiwFlowSign: "Tanda Tangan ECC",
  hiwS1Title: "Gambaran Umum",
  hiwS2Title: "Apa itu Galois Field?",
  hiwS3Title: "Ground Field GF(2¹⁵)",
  hiwS4Title: "Composite Field GF((2¹⁵)¹⁷)",
  hiwS5Title: "Kurva Eliptik (ECC)",
  hiwS6Title: "Hash SHA-1 WinRAR",
  hiwS7Title: "Tanda Tangan Digital ECC",
  hiwS8Title: "Pembuatan Kunci Privat",
  hiwS9Title: "Kunci WinRAR",
  hiwS10Title: "Menghasilkan rarreg.key",
  hiwS11Title: "Ringkasan",
  hiwS12Title: "Glosarium",
});

const zh = t({
  hiwTitle: "WinRAR 注册机是如何工作的？",
  hiwSubtitle: "详细解释用于生成 rarreg.key 的 ECC 签名算法",
  hiwFlowUser: "用户名",
  hiwFlowKey: "生成密钥",
  hiwFlowSign: "ECC 签名",
  hiwS1Title: "概述",
  hiwS2Title: "什么是伽罗瓦域？",
  hiwS3Title: "基础域 GF(2¹⁵)",
  hiwS4Title: "复合域 GF((2¹⁵)¹⁷)",
  hiwS5Title: "椭圆曲线 (ECC)",
  hiwS6Title: "WinRAR 的 SHA-1 哈希",
  hiwS7Title: "ECC 数字签名",
  hiwS8Title: "私钥生成",
  hiwS9Title: "WinRAR 密钥",
  hiwS10Title: "生成 rarreg.key",
  hiwS11Title: "总结",
  hiwS12Title: "术语表",
});

const ko = t({
  hiwTitle: "WinRAR Keygen은 어떻게 작동하나요?",
  hiwSubtitle: "rarreg.key를 생성하는 ECC 서명 알고리즘의 상세 설명",
  hiwFlowUser: "사용자 이름",
  hiwFlowKey: "키 생성",
  hiwFlowSign: "ECC 서명",
  hiwS1Title: "개요",
  hiwS2Title: "갈루아 필드란?",
  hiwS3Title: "기초 필드 GF(2¹⁵)",
  hiwS4Title: "합성 필드 GF((2¹⁵)¹⁷)",
  hiwS5Title: "타원 곡선 (ECC)",
  hiwS6Title: "WinRAR의 SHA-1 해시",
  hiwS7Title: "ECC 디지털 서명",
  hiwS8Title: "개인 키 생성",
  hiwS9Title: "WinRAR 키",
  hiwS10Title: "rarreg.key 생성",
  hiwS11Title: "요약",
  hiwS12Title: "용어집",
});

const ja = t({
  hiwTitle: "WinRAR Keygenの仕組み",
  hiwSubtitle: "rarreg.keyを生成するECC署名アルゴリズムの詳細解説",
  hiwFlowUser: "ユーザー名",
  hiwFlowKey: "キー生成",
  hiwFlowSign: "ECC署名",
  hiwS1Title: "概要",
  hiwS2Title: "ガロア体とは？",
  hiwS3Title: "基底体 GF(2¹⁵)",
  hiwS4Title: "合成体 GF((2¹⁵)¹⁷)",
  hiwS5Title: "楕円曲線 (ECC)",
  hiwS6Title: "WinRARのSHA-1ハッシュ",
  hiwS7Title: "ECCデジタル署名",
  hiwS8Title: "秘密鍵生成",
  hiwS9Title: "WinRARの鍵",
  hiwS10Title: "rarreg.key生成",
  hiwS11Title: "まとめ",
  hiwS12Title: "用語集",
});

const fr = t({
  hiwTitle: "Comment fonctionne WinRAR Keygen ?",
  hiwSubtitle: "Explication détaillée de l'algorithme de signature ECC utilisé pour générer rarreg.key",
  hiwFlowUser: "Nom d'utilisateur",
  hiwFlowKey: "Générer la clé",
  hiwFlowSign: "Signature ECC",
  hiwS1Title: "Vue d'ensemble",
  hiwS2Title: "Qu'est-ce qu'un corps de Galois ?",
  hiwS11Title: "Résumé",
  hiwS12Title: "Glossaire",
});

const de = t({
  hiwTitle: "Wie funktioniert WinRAR Keygen?",
  hiwSubtitle: "Eine detaillierte Erklärung des ECC-Signaturalgorithmus zur Erzeugung von rarreg.key",
  hiwFlowUser: "Benutzername",
  hiwFlowKey: "Schlüssel erzeugen",
  hiwFlowSign: "ECC-Signatur",
  hiwS1Title: "Überblick",
  hiwS2Title: "Was ist ein Galois-Feld?",
  hiwS11Title: "Zusammenfassung",
  hiwS12Title: "Glossar",
});

const es = t({
  hiwTitle: "¿Cómo funciona WinRAR Keygen?",
  hiwSubtitle: "Explicación detallada del algoritmo de firma ECC utilizado para generar rarreg.key",
  hiwFlowUser: "Nombre de usuario",
  hiwFlowKey: "Generar clave",
  hiwFlowSign: "Firma ECC",
  hiwS1Title: "Visión general",
  hiwS2Title: "¿Qué es un campo de Galois?",
  hiwS11Title: "Resumen",
  hiwS12Title: "Glosario",
});

const th = t({
  hiwTitle: "WinRAR Keygen ทำงานอย่างไร?",
  hiwSubtitle: "อธิบายรายละเอียดอัลกอริทึม ECC ที่ใช้สร้าง rarreg.key",
  hiwFlowUser: "ชื่อผู้ใช้",
  hiwFlowKey: "สร้างคีย์",
  hiwFlowSign: "ลายเซ็น ECC",
});

const ms = t({
  hiwTitle: "Bagaimana WinRAR Keygen Berfungsi?",
  hiwSubtitle: "Penjelasan terperinci algoritma tandatangan ECC untuk menjana rarreg.key",
  hiwFlowUser: "Nama Pengguna",
  hiwFlowKey: "Jana Kunci",
  hiwFlowSign: "Tandatangan ECC",
});

const ru = t({
  hiwTitle: "Как работает WinRAR Keygen?",
  hiwSubtitle: "Подробное объяснение алгоритма подписи ECC, используемого для генерации rarreg.key",
  hiwFlowUser: "Имя пользователя",
  hiwFlowKey: "Генерация ключа",
  hiwFlowSign: "Подпись ECC",
  hiwS1Title: "Обзор",
  hiwS2Title: "Что такое поле Галуа?",
  hiwS11Title: "Итого",
  hiwS12Title: "Глоссарий",
});

const fil = t({
  hiwTitle: "Paano Gumagana ang WinRAR Keygen?",
  hiwSubtitle: "Detalyadong paliwanag ng ECC signature algorithm na ginagamit para gumawa ng rarreg.key",
  hiwFlowUser: "Username",
  hiwFlowKey: "Gumawa ng Key",
  hiwFlowSign: "ECC Signature",
});

const pt = t({
  hiwTitle: "Como o WinRAR Keygen Funciona?",
  hiwSubtitle: "Explicação detalhada do algoritmo de assinatura ECC usado para gerar rarreg.key",
  hiwFlowUser: "Nome de Usuário",
  hiwFlowKey: "Gerar Chave",
  hiwFlowSign: "Assinatura ECC",
  hiwS1Title: "Visão Geral",
  hiwS2Title: "O que é um Campo de Galois?",
  hiwS11Title: "Resumo",
  hiwS12Title: "Glossário",
});

export const hiwTranslations: Record<string, HiwTranslation> = {
  en, vi, id, zh, ko, ja, fr, de, es, th, ms, ru, fil, pt,
};
