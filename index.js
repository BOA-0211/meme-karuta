/*
 * ====================================================
 *  カードデータ（後から差し替えてください）
 *
 *  各カードオブジェクト:
 *    id    : カードID（遷移先URL・画像ファイル名に使用）
 *    name  : カード名（縦書き表示）
 *    image : 画像ファイル名（./gallery/ 以下）
 *            ファイルが存在しない場合は「カード〇〇〇画像なし」と表示
 * ====================================================
 */
const CARDS = [
  { id: "card-001", name: "カード001", image: "card-001.png" },
  { id: "card-002", name: "カード002", image: "card-002.png" },
  { id: "card-003", name: "カード003", image: "card-003.png" },
  { id: "card-004", name: "カード004", image: "card-004.png" },
  { id: "card-005", name: "カード005", image: "card-005.png" },
  { id: "card-006", name: "カード006", image: "card-006.png" },
  { id: "card-007", name: "カード007", image: "card-007.png" },
  { id: "card-008", name: "カード008", image: "card-008.png" },
  { id: "card-009", name: "カード009", image: "card-009.png" },
  { id: "card-010", name: "カード010", image: "card-010.png" },
  { id: "card-011", name: "カード011", image: "card-011.png" },
  { id: "card-012", name: "カード012", image: "card-012.png" },
  { id: "card-013", name: "カード013", image: "card-013.png" },
  { id: "card-014", name: "カード014", image: "card-014.png" },
  { id: "card-015", name: "カード015", image: "card-015.png" },
  { id: "card-016", name: "カード016", image: "card-016.png" },
  { id: "card-017", name: "カード017", image: "card-017.png" },
  { id: "card-018", name: "カード018", image: "card-018.png" },
  { id: "card-019", name: "カード019", image: "card-019.png" },
  { id: "card-020", name: "カード020", image: "card-020.png" },
  { id: "card-021", name: "カード021", image: "card-021.png" },
  { id: "card-022", name: "カード022", image: "card-022.png" },
  { id: "card-023", name: "カード023", image: "card-023.png" },
  { id: "card-024", name: "カード024", image: "card-024.png" },
  { id: "card-025", name: "カード025", image: "card-025.png" },
  { id: "card-026", name: "カード026", image: "card-026.png" },
  { id: "card-027", name: "カード027", image: "card-027.png" },
  { id: "card-028", name: "カード028", image: "card-028.png" },
  { id: "card-029", name: "カード029", image: "card-029.png" },
  { id: "card-030", name: "カード030", image: "card-030.png" },
  { id: "card-031", name: "カード031", image: "card-031.png" },
  { id: "card-032", name: "カード032", image: "card-032.png" },
  { id: "card-033", name: "カード033", image: "card-033.png" },
  { id: "card-034", name: "カード034", image: "card-034.png" },
  { id: "card-035", name: "カード035", image: "card-035.png" },
  { id: "card-036", name: "カード036", image: "card-036.png" },
  { id: "card-037", name: "カード037", image: "card-037.png" },
  { id: "card-038", name: "カード038", image: "card-038.png" },
  { id: "card-039", name: "カード039", image: "card-039.png" },
  { id: "card-040", name: "カード040", image: "card-040.png" },
  { id: "card-041", name: "カード041", image: "card-041.png" },
  { id: "card-042", name: "カード042", image: "card-042.png" },
  { id: "card-043", name: "カード043", image: "card-043.png" },
  { id: "card-044", name: "カード044", image: "card-044.png" },
  { id: "card-045", name: "カード045", image: "card-045.png" },
  { id: "card-046", name: "カード046", image: "card-046.png" },
  { id: "card-047", name: "カード047", image: "card-047.png" },
  { id: "card-048", name: "カード048", image: "card-048.png" },
  { id: "card-049", name: "カード049", image: "card-049.png" },
  { id: "card-050", name: "カード050", image: "card-050.png" },
];

/* ====================================================
 *  予備カード検出の設定
 *
 *  ── ① 連番プローブ（自動） ──
 *  PROBE_START 番から順に画像の実在を確認します。
 *  PROBE_MISS_LIMIT 枚連続で見つからなかったら打ち切り。
 *  ※ 番号が飛んでいる場合は PROBE_MISS_LIMIT を増やすか②を使ってください。
 *
 *  ── ② 手動リスト（EXTRA_CARDS） ──
 *  番号体系が異なる・飛び番があるカードはここに直接追記してください。
 * ==================================================== */
const PROBE_START      = 51;
const PROBE_LIMIT      = 200;
const PROBE_MISS_LIMIT = 5;

const EXTRA_CARDS = [
  // 例: { id: "special-001", name: "特別カード001", image: "special-001.png" },
];

/* ================================================
 *  共通ユーティリティ
 * ================================================ */

const GALLERY_PATH = "./gallery/";

/**
 * 画像URLの実在確認
 * @param {string} src
 * @returns {Promise<boolean>}
 */
function checkImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload  = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/**
 * カード要素を生成してグリッドに追加する
 * @param {{ id: string, name: string, image: string }} card
 * @param {HTMLElement} grid  追加先のグリッド要素
 * @param {string[]} [extraClasses]  <a> に追加するクラス名
 */
function appendCardElement(card, grid, extraClasses = []) {
  const a = document.createElement("a");
  a.className = ["card", ...extraClasses].join(" ");
  a.href = `./card/card.html?id=${card.id}`;

  const imageWrap = document.createElement("div");
  imageWrap.className = "card-image";

  checkImage(GALLERY_PATH + card.image).then(exists => {
    if (exists) {
      const img = document.createElement("img");
      img.src = GALLERY_PATH + card.image;
      img.alt = card.name;
      imageWrap.appendChild(img);
    } else {
      imageWrap.classList.add("no-image");
      const label = document.createElement("span");
      label.className = "no-image-label";
      label.textContent = `${card.name}画像なし`;
      imageWrap.appendChild(label);
    }
  });

  const info = document.createElement("div");
  info.className = "card-info";
  const nameEl = document.createElement("p");
  nameEl.className = "card-name";
  nameEl.textContent = card.name;
  info.appendChild(nameEl);

  a.appendChild(imageWrap);
  a.appendChild(info);
  grid.appendChild(a);
}

/* ================================================
 *  メインカード一覧（card-001〜card-050）
 * ================================================ */

const mainGrid = document.getElementById("cardGrid");
CARDS.forEach(card => appendCardElement(card, mainGrid));

/* ================================================
 *  予備カード検出・表示
 * ================================================ */

/** 一覧登録済みのカードID集合 */
const LISTED_IDS = new Set(CARDS.map(c => c.id));

/**
 * 連番プローブ＋手動リストで予備カードを検出する
 * @returns {Promise<Array<{id:string, name:string, image:string}>>}
 */
async function detectExtraCards() {
  const found = [];

  /* ① 連番プローブ */
  let misses = 0;
  for (let n = PROBE_START; n <= PROBE_LIMIT; n++) {
    const id    = `card-${String(n).padStart(3, "0")}`;
    const image = `${id}.png`;
    if (LISTED_IDS.has(id)) continue;

    const exists = await checkImage(GALLERY_PATH + image);
    if (exists) {
      found.push({ id, name: id, image });
      misses = 0;
    } else {
      misses++;
      if (misses >= PROBE_MISS_LIMIT) break;
    }
  }

  /* ② 手動リスト（実在確認付き） */
  for (const card of EXTRA_CARDS) {
    if (LISTED_IDS.has(card.id)) continue;
    if (found.some(f => f.id === card.id)) continue;
    const exists = await checkImage(GALLERY_PATH + card.image);
    if (exists) found.push(card);
  }

  return found;
}

/**
 * 予備カードセクションをページ末尾に追加する
 */
async function buildExtraSection() {
  const extraCards = await detectExtraCards();
  if (extraCards.length === 0) return;

  const section = document.createElement("div");
  section.className = "extra-section";
  section.innerHTML = `
    <div class="extra-section-heading">
      <span class="extra-section-rule"></span>
      <span class="extra-section-title">予備カード</span>
      <span class="extra-section-rule"></span>
    </div>
    <div class="card-grid"></div>
  `;

  const extraGrid = section.querySelector(".card-grid");
  extraCards.forEach(card => appendCardElement(card, extraGrid, ["extra-card"]));

  document.querySelector(".page-wrapper").appendChild(section);
}

buildExtraSection();
