figma.showUI(__html__, { width: 420, height: 640 });

// ─── DS Variable 바인딩 ──────────────────────────────────────────────────────
var DS_VAR_KEYS = {
  'Surface/Primary':   '3c34e5a4484f85d65371830850f59a0870197835',
  'Surface/Secondary': '5f8522491df8b3a8dfdf6de93f44bb9b923df3bd',
  'Surface/Tertiary':  '94c2bd86d07dcab611f900f57de591b0678be487',
  'Surface/Blue':      'dccd14c2e04a5d2f242bd3f5f31ba775fb32d923',
  'Surface/Red':       'ddb74ae7230e930fcc60943c3405045af1df8bae',
  'Surface/Green':     'c71d7d16194865e8654e3af7ffaddbbef1219314',
  'Surface/Yellow':    '27b825cd424770cd8ed09cad8649782db575265a',
  'Contents/Primary':  'a72bd691ffa1de36ce6b259495ed18410140bb3a',
  'Contents/Secondary':'572776f6e58e76231d491cf0457c08eee1d3d1e6',
  'Contents/Tertiary': 'beac4f35fba3bc1178ceb1a16df48afff4346059',
  'Contents/Blue':     'ce5a398b7413b6c3091852fc04907faba44bcf3f',
  'Contents/Red':      '765184bef6c46173097e9449de1f10ab3e558050',
  'Contents/White':    'f15859311f20bd172844925d7312bd3a604135ae',
  'Contents/Green':    '4cd8da9e1abd021f837b153ad07cbc73b9788c7e',
  'Contents/Yellow':   '81794d2ba4e674feb3a2567b3a0a135342df8723',
  'Border/Primary':    '4d09bc256155ca035af4037da86e1ac1fbb43073',
  'Border/Secondary':  '63f86ad5b0840e1801fcae16d2d780dfb32b03b4',
  'Border/Tertiary':   '94417af868a1aecae655e5af6aee5320bf7421c6',
  'Overlay/Primary':   '90f7a32c4d73c0e03f328e8a9cb519cd6e89c47d',
  'Focus/Focus':       '90cf596e4b02e39fc8c925ebf228bd6fa0a30390',
};

// TOKENS → DS Variable 매핑
var TOKEN_TO_VAR = {
  white:            'Surface/Primary',
  gray50:           'Surface/Secondary',
  gray100:          'Surface/Tertiary',
  contentPrimary:   'Contents/Primary',
  contentSecondary: 'Contents/Secondary',
  contentDisabled:  'Contents/Tertiary',
  contentBlue:      'Contents/Blue',
  contentRed:       'Contents/Red',
  contentWhite:     'Contents/White',
  borderDefault:    'Border/Primary',
  borderSub:        'Border/Secondary',
  borderAccent:     'Focus/Focus',
  black:            'Overlay/Primary',
};

// Variable import 캐시
var _varCache = {};
async function importDsVar(tokenName) {
  var varName = TOKEN_TO_VAR[tokenName];
  if (!varName) return null;
  var key = DS_VAR_KEYS[varName];
  if (!key) return null;
  if (_varCache[key]) return _varCache[key];
  try {
    var v = await figma.variables.importVariableByKeyAsync(key);
    _varCache[key] = v;
    return v;
  } catch(e) {
    return null;
  }
}

async function bindFill(node, tokenName) {
  var v = await importDsVar(tokenName);
  if (v && node.fills && node.fills.length > 0) {
    var paint = JSON.parse(JSON.stringify(node.fills[0]));
    paint.boundVariables = { color: { type: 'VARIABLE_ALIAS', id: v.id } };
    node.fills = [paint];
  }
}

async function bindStroke(node, tokenName) {
  var v = await importDsVar(tokenName);
  if (v && node.strokes && node.strokes.length > 0) {
    var paint = JSON.parse(JSON.stringify(node.strokes[0]));
    paint.boundVariables = { color: { type: 'VARIABLE_ALIAS', id: v.id } };
    node.strokes = [paint];
  }
}

// hex → token name 역매핑 (custom 렌더에서 사용)
var HEX_TO_TOKEN = {
  '#ffffff': 'white', '#f9fafb': 'gray50', '#f3f5f8': 'gray100',
  '#e6e9eb': 'borderDefault', '#c9cdd2': 'borderSub',
  '#1a1b22': 'contentPrimary', '#6b6c74': 'contentSecondary',
  '#85878a': 'contentDisabled', '#0066ff': 'contentBlue',
  '#e53935': 'contentRed', '#000000': 'black',
};

async function bindFillByHex(node, hex, field) {
  if (!hex) return;
  var tokenName = HEX_TO_TOKEN[hex.toLowerCase()];
  if (!tokenName) return;
  if (field === 'strokes') {
    await bindStroke(node, tokenName);
  } else {
    await bindFill(node, tokenName);
  }
}

// ─── DS Text Style 바인딩 ────────────────────────────────────────────────────
// 네이밍: {b|m}{size}/l{1|2|3} — b=Bold, m=Medium, l3=body용 lineHeight
var TEXT_STYLE_KEYS = {
  'm12/l3': '690cc29cd9f144bbc2be6958fd6b6daf5f1753d2',
  'm14/l3': '609eac1be0f8dd6501a0db4a14651976027769f0',
  'm16/l3': '766f0db19abcb9e1dbd07e8cb98510f1ef99b731',
  'm18/l3': '8a0a8704dbeae687a02b3acd70c484380860e1b7',
  'm20/l3': '98dbd1ca03fe0c953ca8bc2a291303b5b3d5ba1a',
  'm24/l3': '399c7a47e6eadf2d3a8a739fa6f885ad71a2ec06',
  'm28/l3': '5be9eb16f65e5bb18aa3b6b1c6d86593ebda96a2',
  'm32/l3': 'e27961eaf0926ab6bb8be37356fd20c079937b45',
  'b12/l3': 'ead9b72c314fe6a4b278bf0bd0fbb84bffb713aa',
  'b14/l3': '8793291b74422c4acf6153c9f2c34457b93c8a7b',
  'b16/l3': '0f1ee0d7f341efae86b50878563e790c88c34285',
  'b18/l3': '7d9ff11b1c8d0cd10a0307f7a7dff83e83c44db1',
  'b20/l3': 'f7472d28144755e531cbea8829f23006082b61cd',
  'b24/l3': '880e3ac9c236da1e58135af5dba47d06929bff3d',
  'b28/l3': 'aad17f4614650978ea55afd1dc2c7c774865a74b',
  'b32/l3': 'b6240aebf443045eb77f9edd29f0a38e63ce85a3',
  'm12/l2': 'cd8774807d11bdc5a0329d0cbc24a6339478e04f',
  'm14/l2': '7d354105ec1e0a8af50d3e646211f951d9be5084',
  'm16/l2': 'b86dda2a1aa8c779f768e36c8b84af4ad41e44c0',
  'm18/l2': 'd1423b8b0c013f5e19886e6b03b84e91c7aae9d8',
  'm20/l2': '32f296718720a8297da88076167ee072d89c3ab6',
  'm24/l2': 'cebe238dc10477370fb377647a570e3e8e9fa289',
  'm28/l2': '47072c0b22f864c97375a5ba962f71e263f4815f',
  'm32/l2': 'eece814e06463d19c31da96ce21f03a4ae623972',
  'b12/l2': '5bffd03b6693e976847059793fcd0c2c51f990b4',
  'b14/l2': 'b99104c02b01399b26a2de6df4cd1684b157913a',
  'b16/l2': 'a925bd11238b26975ea3a10c189a78e631c98b9b',
  'b18/l2': '1cfc08ab7e4e06460fa1bd1eb90ee4719d872b94',
  'b20/l2': 'e785203145618ec88a4b9360b643d85b847d4ea6',
  'b24/l2': 'c588b8ee251a94f5c193eb801ed08803a8d89b5c',
  'b28/l2': 'cad1def68d34c164a947a9505858c5adabf858dd',
  'b32/l2': '0be0f078f63845cacc5af99500929c9becd7afe3',
};

var _styleCache = {};
async function importTextStyle(styleName) {
  var key = TEXT_STYLE_KEYS[styleName];
  if (!key) return null;
  if (_styleCache[key]) return _styleCache[key];
  try {
    var style = await figma.importStyleByKeyAsync(key);
    _styleCache[key] = style;
    return style;
  } catch(e) {
    return null;
  }
}

async function bindTextStyle(textNode, fontSize, weight) {
  var prefix = weight >= 700 ? 'b' : 'm';
  // l3 = body용 (기본), l2 = heading용
  var lh = fontSize >= 20 ? 'l2' : 'l3';
  var styleName = prefix + fontSize + '/' + lh;
  var style = await importTextStyle(styleName);
  if (style) {
    textNode.textStyleId = style.id;
  }
}

// ─── 프레임 선택 자동 감지 ────────────────────────────────────────────────────
figma.on('selectionchange', function() {
  var sel = figma.currentPage.selection;
  if (sel.length !== 1) {
    figma.ui.postMessage({ type: 'SELECTION', name: null });
    return;
  }

  var node = sel[0];

  // Case 1: 최상위 플러그인 프레임 선택 → 전체 편집 모드
  if (node.type === 'FRAME' && node.getPluginData('design')) {
    figma.ui.postMessage({
      type: 'SELECTION', name: node.name, mode: 'edit',
      designJson: node.getPluginData('design'), nodeId: node.id
    });
    return;
  }

  // Case 2: 플러그인 프레임 내부 자식 선택 → 부분 편집 모드
  var rootFrame = findPluginFrame(node);
  if (rootFrame) {
    var jsonPath = findNearestJsonPath(node, rootFrame);
    if (jsonPath) {
      var design = JSON.parse(rootFrame.getPluginData('design'));
      var partial = getJsonAtPath(design, jsonPath);
      if (partial) {
        figma.ui.postMessage({
          type: 'SELECTION', name: rootFrame.name, mode: 'partial-edit',
          designJson: rootFrame.getPluginData('design'),
          partialJson: JSON.stringify(partial),
          jsonPath: jsonPath,
          nodeId: rootFrame.id,
          selectedName: node.name || partial.type || 'component'
        });
        return;
      }
    }
    // jsonPath 없는 내부 노드 → 전체 편집 모드로 fallback
    var stored = rootFrame.getPluginData('design');
    if (stored) {
      figma.ui.postMessage({
        type: 'SELECTION', name: rootFrame.name, mode: 'edit',
        designJson: stored, nodeId: rootFrame.id
      });
      return;
    }
  }

  // Case 3: 플러그인과 무관한 프레임
  if (node.type === 'FRAME') {
    figma.ui.postMessage({ type: 'SELECTION', name: node.name, mode: null, nodeId: node.id });
  } else {
    figma.ui.postMessage({ type: 'SELECTION', name: null });
  }
});

// ─── Component Key 매핑 테이블 ───────────────────────────────────────────────
const KEYS = {
  Top: {
    xl:     '291956365af77426912369ace277a3a2f478c1ff',
    large:  '841fb8c0ae1d952d4f408ae8b73fdfca4bacc1e8',
    medium: 'd13dcbc09694178aa71e97ad01017beb1d5c927d',
    small:  '9bfff0b4bc1b751a10a1c3b260fbcfc04a360b47',
  },
  Table: {
    default: '63e23ac9c4a40d66f0c967612051b1efd0990222',
    loading: 'dfb8473d44205da616edc05fe5aa0a9e7cb58332',
    error:   '60006be92d39aa1e995a2917890072f323c050df',
  },
  Button: {
    // size=medium, status=enabled, focused=false — 아이콘 없이 사용 (Icon-wrapper 숨김)
    primary:   'f4bfdf283c99d451eae99465e9162fa101170f5e', // #0066FF 파랑
    secondary: 'd3c106630723de2280a6fb3cccccaf5905900c8d', // #2F3133 짙은 회색
    tertiary:  '4cf3b12d923b85c251c5307a96cf4c3ad615b191', // #F9FAFB 밝은 회색
    tertiary2: '2212e07cd1db970accd06b11bbcbf4312149af73', // #FFFFFF 흰 배경+테두리
  },
  Modal: {
    withTitle:    '4ce790ee93c4f89cc63b10d0c7abceb5e4c3349c', // title and description=true
    withoutTitle: '5d0f64804ca055bd3a2d1737f979cac2d2fd69a8', // title and description=false
  },
  // Horizontal Layout — number 변형 (1~14 슬롯)
  HorizLayout: {
    1:  '009ef63f19813a709317bfd7f0db2bdbe8f9502c',
    2:  'b1085b8bdf36d140ba312a6aa010a3822ec58f24',
    3:  '344506a6ea76f5ba888e2742ab7b4393dd61fdf7',
    4:  '280f881b55b0e2a50304197f30206e90b172fe50',
    5:  '809e748d5ba0f881943b09246936fab8dacb73a8',
    6:  '4236e80536ccffbcf4221575f78b358da4fea938',
  },
  HeaderCell: {
    40:   'e646a92b329639488c3c24fbc0a67be7d2830a82',
    60:   '640d28b4c2d5338861f235e245b864366bf6a4b8',
    80:   '69e381859df15234912a12c5af0b446483505ccb',
    90:   '6864eb84a8147151af695a6094e662db9e7fc9e9',
    100:  '98b9f747821d647c3bd273f829733b55827056fd',
    120:  'b4b8eb8e26e9b6f5aedaa8835115de3204f7cff4',
    160:  '5cf34193a759a56fdfe13109d4318d31e8248fa0',
    200:  '6cdce6b226c1d667d5189093033e83d66f53e23b',
    240:  'bac95b0368331cbd0e47890b52c65bf3fb8946ec',
    320:  '08eba3bd4f3687bc66c261397701a78a3befb951',
    360:  '319b358962a18307d01c036552b64ff4eef35707',
    fill: 'd7388f5355ad49473b889ac0ecc049f4b7281984',
  },
  ContentsCell: {
    text:   '57a706337418463b84a3926046f7f523bf83e123',
    badge:  '46afd0d15c0dab7a57280c5ec3a5e49ab93147dd',
    button: '94e09efc0e089228a1747ce8922ae24edaf98843',
  },
  SearchBar: {
    small:  '3e9f184f6b4b5955d44cff06c186200c86171f98', // status=enabled, size=small
    medium: 'a52a21b2787e2ca6713eda4446757facd7eb1d3c', // status=enabled, size=medium
    large:  '2009d7bbeb638f5eeb905c8bfd5e0a0f12714a7c', // status=enabled, size=large
  },
  Chip: {
    unselected: '21a2c60fba46eeedeebc0e2252571cf3b57afcea', // selected=false, size=small
    selected:   'c6b79bb249999757948621f989e0b31919f5474e', // selected=true, size=small
  },
  Spinner: {
    32: '0beff0ad7caddd7a9166ced437b40f435bbe71bd',
    48: '7eca76e2e859a21a588dae041520c2be2863b179',
    64: 'abe1aede909c398e14eea54e3f8c4249df7bef9f',
  },
  Breadcrumb: '0cb637284583a03948464da788e34b974e4ff93c',
  Pagination: {
    center: 'c7e24ffb8716438a9eebd083cd7624ebcaf1a85f',
  },
  Signal: {
    backlog:    '9f48c2ac1dc41717dcc9c176c540899814830ab5',
    inProgress: '7cfcfcecf65c672800b283e29e16076a877d2e0f',
    done:       '4dc022fdfd2425c079ef776bbfc354326ed36bb6',
    error:      'c87f5277c2d32d889e2b9eac5f8bd1f042c0bda4',
    pending:    '5215257a4b5d3b703f906a22e81e87ea4dc506bf',
  },
  TextField: {
    enabled:  'cb1a740683ba7ab9e02b40ffb95e6bc6e587c64d', // status=enabled, size=medium
    focused:  'fa9738115fe5e9fd488942d69748d366d9807253', // status=focused, size=medium
    error:    '114e90ba7308289584e84ee6178a03c41d3ab83c', // status=error, size=medium
    disabled: 'd18279ec736d1a52fdd5cbca254a5a8eaf7ff0ac', // status=disabled, size=medium
  },
  TextArea: {
    enabled:  '670b3524070939dc16a57198ed2c4917724b0a01', // status=enabled, size=medium
    focused:  '3ec227637b5d30ee9cf4cd9ba59058cda2fbce88', // status=focused, size=medium
    error:    '4c8a6123ba9e1eb2d6fe28e28fc6134802d6a526', // status=error, size=medium
    disabled: '67acb5441a65f836178cc43b69efb60735970e19', // status=disabled, size=medium
  },
  RadioButton: {
    unselected: 'a7ae31548ff0381631fe4496f8d15edb5d39732c',
    selected:   '95769c99c6c727e2b8e849763efe526e79354c15',
  },
  Checkbox: {
    unselected:   '13ba6b8176d954082179bb82b1e7e5d8cd5c7682',
    selected:     '067e0d99384848b68fdfbb840fa137907becc4d6',
    intermediate: '55e3131fa7f0bfcb49748875e992185b7a5152b8',
  },
  Switch: {
    off: '77d2c746db635937bb9255807bd73eed28b5893f',
    on:  'b4bb8b241e9ea45cbc0137107a7f9d20e7b33563',
  },
  IconButton: {
    primary:   '74e3a61b97fec67eeb54f0e0693867173a541197', // size=xlarge, type=primary
  },
  TextButton: {
    enabled: 'd80e32b2244d3ae08a7fa76c214ac8ad532e5d19', // size=medium, status=enabled
  },
  StatusBadge: {
    backlog:    '1633a092eadb859a4d27048054b4ffb8cdb577de',
    inProgress: '9f014adc36a29c65ed9a5a4595e7709567d33414',
    done:       '24927e05a9c4668614c94c532324948e20a53652',
    error:      '9b79ec65072f599c7b5aad0b548d044cf9f8eca4',
    pending:    '71ce2afdeacc2b05a688b1fa02fb246026a6bf2d',
  },
  Accordion: {
    listOpen:   'ea3b68fcae9bd3b6bb717eea68d94804539d2f84', // dropdown=true, contents=list
    listClosed: '1c96ce516176e2ae9fcf9ccec3eff931ce4bbf0f', // dropdown=false, contents=list
    tableOpen:  '2759dc7f342d5bfcd1160ca06d4e77f1867f6720', // dropdown=true, contents=table
    tableClosed:'d7ea1501d74fad583d7f4cda00baf131a70bb0f3', // dropdown=false, contents=table
  },
  Dialog: {
    'h1': '52fd5faef27731bc9b8fd1217ba9cd1d96e4be3f', // 1 button, horizontal, no contents
    'h2': '026441bccd700a5ca8195a0a3bcc7040378a2204', // 2 button, horizontal, no contents
    'v2': 'd70c5568d0537ac8ab450359f5822461c37e02ff', // 2 button, vertical, no contents
    'v3': 'adb737ef7ea12c3591163a18836616a9264538c1', // 3 button, vertical, no contents
  },
  Toast: {
    text: '76572b0210d48f0c2e68589105eb9405d100dd85', // type=text
  },
  Tooltip: {
    'top-left':      'db73d85768eab0a65e406c457e0a1d455366f538',
    'top-middle':    'b35c364c4d87934ce5542dc26245581091ed616b',
    'top-right':     '14f4a38c37a1b375a15b1cea08973cdd39ea08e7',
    'bottom-left':   'ce9a7a98b59a857b8eca1e923ec8bb6fe0e4133d',
    'bottom-middle': 'd0a3c3f1297801f77ebd0050cbfb3c12fc0febdc',
    'bottom-right':  'a0d263736b671f3f45884b14af1b813d6e1db5f4',
    'left':          'fc82e3c755c47f097b37cac5d863a4ebe6a10e1a',
    'right':         '01b9f080a2b2830343f4f3e8af8079bba52720ee',
  },
  Dropdown: {
    default: '17716b2762b1ff035bdd4321b55e1593d325d3b4', // status=enabled, size=large, selected=false
    medium:  'e5f1e05dda9cd08502fb6bc937d42b72e38b18c0', // status=enabled, size=medium, selected=false
  },
  Tab: {
    container: 'a0922595bd56f9f5f99f5a3158832b17b29676a2', // 전체 Tab 컴포넌트 (10 슬롯)
    selected:  'ce70593e8562530cebf90863b672d79c528aed5c', // Tab/item selected
    unselected:'67857cb441f275f488efa3f2329c9a76d49aa48e', // Tab/item unselected
  },
};

const HEADER_WIDTHS = [40, 60, 80, 90, 100, 120, 160, 200, 240, 320, 360];

function resolveWidth(width) {
  if (width === 'fill' || width === undefined || width === null) return 'fill';
  const num = typeof width === 'number' ? width : parseInt(width, 10);
  if (isNaN(num)) return 'fill';
  let closest = HEADER_WIDTHS[0];
  let minDiff = Math.abs(num - closest);
  for (let i = 1; i < HEADER_WIDTHS.length; i++) {
    const diff = Math.abs(num - HEADER_WIDTHS[i]);
    if (diff < minDiff) { minDiff = diff; closest = HEADER_WIDTHS[i]; }
  }
  return closest;
}

// ─── JSON 경로 헬퍼 ─────────────────────────────────────────────────────────
function getJsonAtPath(obj, path) {
  var parts = path.split('.');
  var current = obj;
  for (var i = 0; i < parts.length; i++) {
    if (current === undefined || current === null) return undefined;
    current = current[parts[i]];
  }
  return current;
}

function setJsonAtPath(obj, path, value) {
  var parts = path.split('.');
  var current = obj;
  for (var i = 0; i < parts.length - 1; i++) {
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

function findPluginFrame(node) {
  var current = node;
  while (current) {
    if (current.type === 'FRAME' && current.getPluginData && current.getPluginData('design')) {
      return current;
    }
    current = current.parent;
  }
  return null;
}

function findNearestJsonPath(node, rootFrame) {
  var current = node;
  while (current && current !== rootFrame) {
    if (current.getPluginData && current.getPluginData('jsonPath')) {
      return current.getPluginData('jsonPath');
    }
    current = current.parent;
  }
  return null;
}

function findNodeByJsonPath(frame, path) {
  return frame.findOne(function(n) {
    return n.getPluginData && n.getPluginData('jsonPath') === path;
  });
}

// 단일 컴포넌트 렌더 디스패치
async function renderSingleChild(parent, config, jsonPath) {
  var prevCount = parent.children.length;
  if      (config.type === 'top')        await renderTop(parent, config);
  else if (config.type === 'table')      await renderTable(parent, config);
  else if (config.type === 'card')       await renderCard(parent, config, jsonPath);
  else if (config.type === 'searchbar')  await renderSearchBar(parent, config);
  else if (config.type === 'filterbar')  await renderFilterBar(parent, config);
  else if (config.type === 'tab')        await renderTab(parent, config);
  else if (config.type === 'chipgroup')  await renderChipGroup(parent, config);
  else if (config.type === 'spinner')    await renderSpinner(parent, config);
  else if (config.type === 'breadcrumb') await renderBreadcrumb(parent, config);
  else if (config.type === 'textfield')  await renderTextField(parent, config);
  else if (config.type === 'textarea')   await renderTextArea(parent, config);
  else if (config.type === 'checkbox')   await renderCheckbox(parent, config);
  else if (config.type === 'radio')      await renderRadioButton(parent, config);
  else if (config.type === 'switch')     await renderSwitch(parent, config);
  else if (config.type === 'formgroup')  await renderFormGroup(parent, config);
  else if (config.type === 'iconbutton') await renderIconButton(parent, config);
  else if (config.type === 'textbutton') await renderTextButton(parent, config);
  else if (config.type === 'pagination') await renderPagination(parent, config);
  else if (config.type === 'tooltip')    await renderTooltip(parent, config);
  else if (config.type === 'accordion')   await renderAccordion(parent, config);
  else if (config.type === 'statusbadge') await renderStatusBadge(parent, config);
  else if (config.type === 'signal')      await renderSignal(parent, config);
  else if (config.type === 'custom')      await renderCustom(parent, config);
  // 태깅
  if (parent.children.length > prevCount) {
    var newNode = parent.children[parent.children.length - 1];
    newNode.setPluginData('jsonPath', jsonPath);
  }
}

// ─── 메시지 수신 ──────────────────────────────────────────────────────────────
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'RENDER') {
    try {
      await renderDesign(msg.design);
      figma.ui.postMessage({ type: 'DONE' });
    } catch (err) {
      figma.ui.postMessage({ type: 'ERROR', error: err.message });
    }
  }


  if (msg.type === 'RENDER_EDIT') {
    figma.ui.postMessage({ type: 'LOG', msg: 'RENDER_EDIT 수신, nodeId=' + msg.nodeId });
    const frame = msg.nodeId ? figma.getNodeById(msg.nodeId) : null;
    if (!frame || frame.type !== 'FRAME') {
      figma.ui.postMessage({ type: 'ERROR', error: '편집할 프레임을 찾을 수 없습니다' });
      return;
    }
    try {
      // 기존 children 제거
      for (let i = frame.children.length - 1; i >= 0; i--) {
        frame.children[i].remove();
      }
      await renderDesign(msg.design, frame);
      figma.ui.postMessage({ type: 'DONE' });
    } catch (err) {
      figma.ui.postMessage({ type: 'ERROR', error: err.message });
    }
  }

  // ─── 부분 편집 ──────────────────────────────────────────────────────────────
  if (msg.type === 'RENDER_PARTIAL') {
    figma.ui.postMessage({ type: 'LOG', msg: 'RENDER_PARTIAL 수신, path=' + msg.jsonPath });
    var frame = msg.nodeId ? figma.getNodeById(msg.nodeId) : null;
    if (!frame || frame.type !== 'FRAME') {
      figma.ui.postMessage({ type: 'ERROR', error: '편집할 프레임을 찾을 수 없습니다' });
      return;
    }
    try {
      var jsonPath = msg.jsonPath;
      var partialDesign = msg.design;

      // 저장된 전체 JSON 업데이트
      var fullDesign = JSON.parse(frame.getPluginData('design'));
      setJsonAtPath(fullDesign, jsonPath, partialDesign);
      frame.setPluginData('design', JSON.stringify(fullDesign));

      // jsonPath로 교체 대상 노드 찾기
      var targetNode = findNodeByJsonPath(frame, jsonPath);
      if (targetNode) {
        var parentNode = targetNode.parent;
        var childIndex = -1;
        for (var ci = 0; ci < parentNode.children.length; ci++) {
          if (parentNode.children[ci] === targetNode) { childIndex = ci; break; }
        }
        targetNode.remove();

        // 해당 컴포넌트만 다시 렌더
        await renderSingleChild(parentNode, partialDesign, jsonPath);

        // 올바른 위치로 이동 + 새 노드 자동 선택 (partial-edit 모드 유지)
        var newNode = parentNode.children[parentNode.children.length - 1];
        if (childIndex >= 0 && parentNode.children.length > 0) {
          if (childIndex < parentNode.children.length - 1) {
            parentNode.insertChild(childIndex, newNode);
          }
        }
        if (newNode) figma.currentPage.selection = [newNode];
        figma.ui.postMessage({ type: 'DONE', info: 'partial: ' + jsonPath });
      } else {
        // fallback: 전체 재렌더
        figma.ui.postMessage({ type: 'LOG', msg: '부분 노드 못 찾음, 전체 재렌더' });
        for (var fi = frame.children.length - 1; fi >= 0; fi--) {
          frame.children[fi].remove();
        }
        await renderDesign(fullDesign, frame);
        figma.ui.postMessage({ type: 'DONE', info: 'full re-render fallback' });
      }
    } catch (err) {
      figma.ui.postMessage({ type: 'ERROR', error: err.message });
    }
  }
};

// ─── Design Tokens ───────────────────────────────────────────────────────────
var TOKENS = {
  // Surface
  white:       { r: 1, g: 1, b: 1 },             // #FFFFFF
  gray50:      { r: 0.976, g: 0.980, b: 0.973 },  // #F9FAFB
  gray100:     { r: 0.953, g: 0.961, b: 0.973 },  // #F3F5F8
  gray200:     { r: 0.902, g: 0.914, b: 0.922 },  // #E6E9EB
  // Contents
  contentPrimary:   { r: 0.102, g: 0.106, b: 0.133 },  // #1A1B22
  contentSecondary: { r: 0.420, g: 0.424, b: 0.455 },  // #6B6C74
  contentDisabled:  { r: 0.522, g: 0.529, b: 0.541 },  // #85878A
  contentBlue:      { r: 0, g: 0.4, b: 1 },             // #0066FF
  contentRed:       { r: 0.898, g: 0.224, b: 0.208 },   // #E53935
  contentWhite:     { r: 1, g: 1, b: 1 },               // #FFFFFF
  // Border
  borderDefault:  { r: 0.902, g: 0.914, b: 0.922 },  // #E6E9EB
  borderSub:      { r: 0.788, g: 0.804, b: 0.824 },  // #C9CDD2
  borderAccent:   { r: 0, g: 0.4, b: 1 },             // #0066FF
  // Overlay
  black:       { r: 0, g: 0, b: 0 },             // #000000
};

// Typography tokens: { size, weight, lineHeight(%) }
var TYPO = {
  label:    { size: 12, weight: 500, lineHeight: 150 },
  body:     { size: 14, weight: 500, lineHeight: 143 },
  bodyM:    { size: 16, weight: 500, lineHeight: 150 },
  bodyL:    { size: 18, weight: 500, lineHeight: 144 },
  subtitle: { size: 20, weight: 700, lineHeight: 130 },
  section:  { size: 24, weight: 700, lineHeight: 133 },
  page:     { size: 28, weight: 700, lineHeight: 129 },
  display:  { size: 32, weight: 700, lineHeight: 125 },
};

var VALID_FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];

function snapToTypo(size) {
  var closest = VALID_FONT_SIZES[0];
  for (var i = 1; i < VALID_FONT_SIZES.length; i++) {
    if (Math.abs(VALID_FONT_SIZES[i] - size) < Math.abs(closest - size)) {
      closest = VALID_FONT_SIZES[i];
    }
  }
  return closest;
}

function getLineHeight(size) {
  for (var key in TYPO) {
    if (TYPO[key].size === size) return TYPO[key].lineHeight;
  }
  return 143; // default body
}

// ─── 렌더 엔진 ────────────────────────────────────────────────────────────────
async function renderDesign(design, existingFrame) {
  const page = figma.currentPage;
  const W = design.width || 1440;
  const H = design.height || 900;
  let frame;
  if (existingFrame) {
    frame = existingFrame;
    frame.name = design.pageName || frame.name;
    frame.resize(W, H);
  } else {
    frame = figma.createFrame();
    frame.name = design.pageName || '화면';
    frame.resize(W, H);
    frame.layoutMode = 'NONE';
    frame.fills = [{ type: 'SOLID', color: TOKENS.gray50 }];
    await bindFill(frame, 'gray50');
    frame.clipsContent = true;
    page.appendChild(frame);
  }
  // 생성한 JSON 저장 (편집 모드에서 재사용)
  frame.setPluginData('design', JSON.stringify(design));

  var sectionList = (design.sections || []).map(function(s) { return s.type; }).join(', ');
  figma.ui.postMessage({ type: 'LOG', msg: 'sections: ' + sectionList });

  const SUPPORTED = ['lnb', 'main', 'modal', 'toast', 'dialog'];
  const skipped = [];

  let lnbWidth = 240;
  var sections = design.sections || [];
  for (var si = 0; si < sections.length; si++) {
    var section = sections[si];
    var sectionPath = 'sections.' + si;
    var prevCount = frame.children.length;
    if (section.type === 'lnb') {
      const lnbNode = await renderLNB(frame, section, H, lnbWidth);
      if (lnbNode) lnbWidth = lnbNode.width;
    } else if (section.type === 'main') {
      await renderMain(frame, section, W - lnbWidth, H, lnbWidth, sectionPath);
    } else if (section.type === 'dialog') {
      await renderDialog(frame, section, W, H);
    } else if (section.type === 'toast') {
      await renderToast(frame, section, W);
    } else if (section.type === 'modal') {
      var modalResult = await renderModal(frame, section, W, H);
      if (modalResult && modalResult.nodeInfo) {
        figma.ui.postMessage({ type: 'LOG', msg: 'Modal 노드: ' + modalResult.nodeInfo });
      }
    } else {
      skipped.push(section.type);
    }
    // section 노드에 jsonPath 태깅
    if (frame.children.length > prevCount) {
      frame.children[frame.children.length - 1].setPluginData('jsonPath', sectionPath);
    }
  }

  if (skipped.length > 0) {
    figma.ui.postMessage({ type: 'WARN', msg: '렌더 불가 섹션: ' + skipped.join(', ') });
  }

  figma.viewport.scrollAndZoomIntoView([frame]);
}

// ─── LNB variant key 매핑 ────────────────────────────────────────────────────
// componentSetId: 5255:4088 — selected × expanded 조합
const LNB_KEYS = {
  '당발송금': { true: 'eea3552b58f8b3433a8a7bf0543fa0cd99752569', false: 'e81588ef6ec8715584d33560638a06038a696b58' },
  '타발송금': { true: 'e5f2f062b6ab3fc4c92b3c6e578ac110bc3b4f21', false: '92158e18e5bd3dd4a602b91d375e63d0fb33568a' },
  '잔액':    { true: '82b445d1712e176685aad721795376997194b8d2', false: 'eee2fbada99afd0a63e5f6ef764373e31c9dce40' },
  '집금관리': { true: 'd935b2f992ccbe1572939a0210ebb0600d970318', false: 'fb774dd94b269ffacc65ebd27ad10dc842dae40b' },
  '문의':    { true: '7f6c6a7d5fc2dada984889eee4e2ca6689a759b0', false: 'b30e9cb2a9a30a00949beb81ac1f1d5d90211bc1' },
  '설정':    { true: 'f3eafcf639e13aba9a54e92549fc08d8833c7b40', false: '5b97b3aa08e88d74cf6ce99e0a0857e68afe22e1' },
  '내 계정': { true: 'f0ec2fce714a50d8da1b50d2484c1046a55fb1d2', false: '511e409fd3049b10bb1057d3d1fe673873f8e797' },
};

// 하위 메뉴 → 상위 메뉴 매핑
const LNB_SUBMENU_MAP = {
  '대량송금': '당발송금',
  '당발송금 목록': '당발송금',
  '타발송금 목록': '타발송금',
  '잔액 현황': '잔액',
  '집금 목록': '집금관리',
};

function resolveLnbKey(menuItems) {
  const active = (menuItems || []).find(function(m) { return m.active; });
  if (!active) return LNB_KEYS['당발송금'][true];

  const label = active.label;

  // 직접 매핑
  if (LNB_KEYS[label]) return LNB_KEYS[label][true];

  // 하위메뉴 매핑
  const parent = LNB_SUBMENU_MAP[label];
  if (parent && LNB_KEYS[parent]) return LNB_KEYS[parent][true];

  // 부분 문자열 매칭 (예: '당발' 포함)
  const keys = Object.keys(LNB_KEYS);
  for (let i = 0; i < keys.length; i++) {
    if (label.indexOf(keys[i]) !== -1 || keys[i].indexOf(label) !== -1) {
      return LNB_KEYS[keys[i]][true];
    }
  }

  return LNB_KEYS['당발송금'][true]; // fallback
}

// ─── LNB ──────────────────────────────────────────────────────────────────────
async function renderLNB(parent, section, H, W) {
  const key = resolveLnbKey(section.menuItems);
  const comp = await figma.importComponentByKeyAsync(key);
  const instance = comp.createInstance();
  instance.x = 0;
  instance.y = 0;
  parent.appendChild(instance);

  // 높이를 화면 전체에 맞춤
  instance.layoutSizingVertical = 'FIXED';
  instance.resize(instance.width, H);
  return instance;
}

// ─── Main 영역 ────────────────────────────────────────────────────────────────
async function renderMain(parent, section, W, H, offsetX, sectionPath) {
  const pad = section.padding !== undefined ? section.padding : 16;
  const gap = section.gap !== undefined ? section.gap : 16;
  const main = figma.createFrame();
  main.name = 'Main';
  main.x = offsetX;
  main.y = 0;
  main.resize(W, H);
  main.layoutMode = 'VERTICAL';
  main.itemSpacing = gap;
  main.paddingTop = pad;
  main.paddingBottom = pad;
  main.paddingLeft = pad;
  main.paddingRight = pad;
  main.fills = [];
  parent.appendChild(main);

  var children = section.children || [];
  for (var mi = 0; mi < children.length; mi++) {
    var child = children[mi];
    var childPath = (sectionPath || 'sections.1') + '.children.' + mi;
    var prevCount = main.children.length;
    if      (child.type === 'top')        await renderTop(main, child);
    else if (child.type === 'table')      await renderTable(main, child);
    else if (child.type === 'card')       await renderCard(main, child, childPath);
    else if (child.type === 'searchbar')  await renderSearchBar(main, child);
    else if (child.type === 'filterbar')  await renderFilterBar(main, child);
    else if (child.type === 'tab')        await renderTab(main, child);
    else if (child.type === 'chipgroup')  await renderChipGroup(main, child);
    else if (child.type === 'spinner')    await renderSpinner(main, child);
    else if (child.type === 'breadcrumb') await renderBreadcrumb(main, child);
    else if (child.type === 'textfield')  await renderTextField(main, child);
    else if (child.type === 'textarea')   await renderTextArea(main, child);
    else if (child.type === 'checkbox')   await renderCheckbox(main, child);
    else if (child.type === 'radio')      await renderRadioButton(main, child);
    else if (child.type === 'switch')     await renderSwitch(main, child);
    else if (child.type === 'formgroup')  await renderFormGroup(main, child);
    else if (child.type === 'iconbutton') await renderIconButton(main, child);
    else if (child.type === 'textbutton') await renderTextButton(main, child);
    else if (child.type === 'pagination') await renderPagination(main, child);
    else if (child.type === 'tooltip')    await renderTooltip(main, child);
    else if (child.type === 'accordion')   await renderAccordion(main, child);
    else if (child.type === 'statusbadge') await renderStatusBadge(main, child);
    else if (child.type === 'signal')      await renderSignal(main, child);
    else if (child.type === 'custom')      await renderCustom(main, child);
    else figma.ui.postMessage({ type: 'WARN', msg: '미지원 컴포넌트: ' + child.type });
    // children 태깅
    if (main.children.length > prevCount) {
      main.children[main.children.length - 1].setPluginData('jsonPath', childPath);
    }
  }
}

// ─── Top ──────────────────────────────────────────────────────────────────────
async function renderTop(parent, config) {
  const key = KEYS.Top[config.size] !== undefined ? KEYS.Top[config.size] : KEYS.Top.large;
  const comp = await figma.importComponentByKeyAsync(key);
  const instance = comp.createInstance();
  parent.appendChild(instance);
  instance.layoutSizingHorizontal = 'FILL';

  // 제목 오버라이드 (name='title')
  const titleNode = instance.findOne(function(n) { return n.type === 'TEXT' && n.name === 'title'; });
  if (titleNode && config.title) {
    try {
      await figma.loadFontAsync(titleNode.fontName);
      titleNode.characters = config.title;
    } catch (e) {}
  }

  // 설명 오버라이드 (name='description')
  const descNode = instance.findOne(function(n) { return n.type === 'TEXT' && n.name === 'description'; });
  if (descNode && config.description) {
    try {
      await figma.loadFontAsync(descNode.fontName);
      descNode.characters = config.description;
    } catch (e) {}
  }

  // 오른쪽 버튼 슬롯 교체 (detach 없이 swapComponent 방식)
  const buttons = config.rightButtons || [];
  if (buttons.length > 0) {
    const horizLayout = instance.findOne(function(n) {
      return n.name === 'Horizontal Layout' && n.type === 'INSTANCE';
    });
    if (horizLayout) {
      // 1. Horizontal Layout을 버튼 수에 맞는 number 변형으로 교체
      const numKey = KEYS.HorizLayout[buttons.length] || KEYS.HorizLayout[1];
      const numComp = await figma.importComponentByKeyAsync(numKey);
      horizLayout.swapComponent(numComp);

      // swapComponent 후 간격 명시 설정
      horizLayout.itemSpacing = 8;
      horizLayout.counterAxisAlignItems = 'CENTER';

      // 2. BASE-Container 슬롯을 실제 버튼으로 교체
      const slots = horizLayout.findAll(function(n) {
        return n.name === 'BASE-Container' && n.type === 'INSTANCE';
      });

      for (let i = 0; i < buttons.length && i < slots.length; i++) {
        const btn = buttons[i];
        const variant = btn.variant !== undefined ? btn.variant : 'secondary';
        const btnKey = KEYS.Button[variant] !== undefined
          ? KEYS.Button[variant]
          : KEYS.Button.secondary;
        const btnComp = await figma.importComponentByKeyAsync(btnKey);
        slots[i].swapComponent(btnComp);
        slots[i].layoutSizingVertical = 'FIXED';
        slots[i].resize(slots[i].width, 40);

        // 아이콘 슬롯 숨기기 (icon 미지정 시)
        if (!btn.icon) {
          const iconNodes = slots[i].findAll(function(n) {
            return n.name === 'Icon-wrapper';
          });
          for (let j = 0; j < iconNodes.length; j++) {
            iconNodes[j].visible = false;
          }
        }

        // 버튼 텍스트: name='Button' 노드 직접 탐색
        const textNode = slots[i].findOne(function(n) {
          return n.type === 'TEXT' && n.name === 'Button';
        });
        if (textNode && btn.label) {
          try {
            await figma.loadFontAsync(textNode.fontName);
            textNode.characters = btn.label;
          } catch (e) {}
        }
      }
    }
  }

  return instance;
}

// ─── Table ────────────────────────────────────────────────────────────────────
async function renderTable(parent, config) {
  const columns = config.columns || [];
  const state = config.state || 'default';

  if (state !== 'default') {
    const key = KEYS.Table[state] !== undefined ? KEYS.Table[state] : KEYS.Table.default;
    const comp = await figma.importComponentByKeyAsync(key);
    const instance = comp.createInstance();
    parent.appendChild(instance);
    instance.layoutSizingHorizontal = 'FILL';
    return instance;
  }

  if (columns.length === 0) {
    const comp = await figma.importComponentByKeyAsync(KEYS.Table.default);
    const instance = comp.createInstance();
    parent.appendChild(instance);
    instance.layoutSizingHorizontal = 'FILL';
    return instance;
  }

  // 테이블 외부 프레임
  const tableFrame = figma.createFrame();
  tableFrame.name = 'Table';
  tableFrame.layoutMode = 'VERTICAL';
  tableFrame.itemSpacing = 0;
  tableFrame.fills = [{ type: 'SOLID', color: TOKENS.white }];
  tableFrame.strokes = [{ type: 'SOLID', color: TOKENS.borderDefault }];
  await bindFill(tableFrame, 'white');
  await bindStroke(tableFrame, 'borderDefault');
  tableFrame.strokeWeight = 1;
  tableFrame.cornerRadius = 8;
  tableFrame.clipsContent = true;
  parent.appendChild(tableFrame);
  tableFrame.layoutSizingHorizontal = 'FILL';
  tableFrame.layoutSizingVertical = 'HUG';

  // 헤더 행
  const headerRow = figma.createFrame();
  headerRow.name = 'Header Row';
  headerRow.layoutMode = 'HORIZONTAL';
  headerRow.itemSpacing = 0;
  headerRow.fills = [{ type: 'SOLID', color: TOKENS.gray50 }];
  await bindFill(headerRow, 'gray50');
  tableFrame.appendChild(headerRow);
  headerRow.layoutSizingHorizontal = 'FILL';
  headerRow.layoutSizingVertical = 'HUG';

  for (let ci = 0; ci < columns.length; ci++) {
    const col = columns[ci];
    const w = resolveWidth(col.width);
    const headerKey = w === 'fill' ? KEYS.HeaderCell.fill : KEYS.HeaderCell[w];
    const comp = await figma.importComponentByKeyAsync(headerKey);
    const cell = comp.createInstance();
    headerRow.appendChild(cell);
    if (w === 'fill') { cell.layoutSizingHorizontal = 'FILL'; }

    const textNodes = cell.findAll(function(n) { return n.type === 'TEXT'; });
    if (textNodes.length > 0) {
      try {
        await figma.loadFontAsync(textNodes[0].fontName);
        textNodes[0].characters = col.label;
      } catch (e) {}
    }
  }

  // 데이터 행
  const rowCount = config.rowCount !== undefined ? config.rowCount : 3;
  const rows = config.rows !== undefined ? config.rows : null;

  for (let r = 0; r < rowCount; r++) {
    const rowData = (rows && rows[r]) ? rows[r] : null;

    const dataRow = figma.createFrame();
    dataRow.name = 'Row ' + (r + 1);
    dataRow.layoutMode = 'HORIZONTAL';
    dataRow.itemSpacing = 0;
    dataRow.fills = [{ type: 'SOLID', color: TOKENS.white }];
    await bindFill(dataRow, 'white');
    tableFrame.appendChild(dataRow);
    dataRow.layoutSizingHorizontal = 'FILL';
    dataRow.layoutSizingVertical = 'HUG';

    for (let ci = 0; ci < columns.length; ci++) {
      const col = columns[ci];
      const colType = col.type !== undefined ? col.type : 'text';
      const cellKey = KEYS.ContentsCell[colType] !== undefined
        ? KEYS.ContentsCell[colType]
        : KEYS.ContentsCell.text;
      const comp = await figma.importComponentByKeyAsync(cellKey);
      const cell = comp.createInstance();
      dataRow.appendChild(cell);

      const w = resolveWidth(col.width);
      if (w === 'fill') {
        cell.layoutSizingHorizontal = 'FILL';
      } else {
        cell.layoutSizingHorizontal = 'FIXED';
        cell.resize(w, 48);
      }

      // 셀 값 오버라이드
      const cellValue = (rowData && rowData[ci] !== undefined) ? String(rowData[ci]) : null;
      if (cellValue && cellValue !== '') {
        if (colType === 'badge') {
          // ContentsCell 안의 StatusBadge 인스턴스 찾기
          var badgeStatusMap = {
            'backlog': 'backlog', '대기': 'backlog',
            'in progress': 'in progress', 'inProgress': 'in progress', '처리중': 'in progress', '진행중': 'in progress',
            'done': 'done', '완료': 'done',
            'error': 'error', '실패': 'error', '에러': 'error',
            'pending': 'pending', '보류': 'pending',
          };
          var badgeStatus = badgeStatusMap[cellValue] || badgeStatusMap[cellValue.toLowerCase()] || 'backlog';
          // ContentsCell 안의 Status Badge 인스턴스에서 status variant 변경
          try {
            var allInstances = cell.findAll(function(n) { return n.type === 'INSTANCE'; });
            for (var ii = 0; ii < allInstances.length; ii++) {
              var inst = allInstances[ii];
              var instProps = inst.componentProperties;
              for (var pName in instProps) {
                if (pName.toLowerCase().indexOf('status') >= 0) {
                  inst.setProperties({ [pName]: badgeStatus });
                  break;
                }
              }
            }
          } catch(e) {}
          // label 텍스트 업데이트
          var badgeTexts = cell.findAll(function(n) { return n.type === 'TEXT'; });
          for (var ti = 0; ti < badgeTexts.length; ti++) {
            try {
              await figma.loadFontAsync(badgeTexts[ti].fontName);
              badgeTexts[ti].characters = cellValue;
            } catch(e) {}
          }
        } else {
          var textNodes = cell.findAll(function(n) { return n.type === 'TEXT'; });
          if (textNodes.length > 0) {
            try {
              await figma.loadFontAsync(textNodes[0].fontName);
              textNodes[0].characters = cellValue;
            } catch (e) {}
          }
        }
      }
    }
  }

  // pagination 옵션
  if (config.pagination) {
    await renderPagination(tableFrame, {});
  }

  return tableFrame;
}

// ─── Card (섹션 wrapper) ──────────────────────────────────────────────────────
async function renderCard(parent, config, cardPath) {
  const card = figma.createFrame();
  card.name = config.title || 'Card';
  card.layoutMode = 'VERTICAL';
  card.itemSpacing = 12;
  card.paddingTop = 16;
  card.paddingBottom = 16;
  card.paddingLeft = 16;
  card.paddingRight = 16;
  card.cornerRadius = 12;
  card.fills = [{ type: 'SOLID', color: TOKENS.white }];
  await bindFill(card, 'white');
  parent.appendChild(card);
  card.layoutSizingHorizontal = 'FILL';
  card.layoutSizingVertical = 'HUG';

  var children = config.children || [];
  for (var ci = 0; ci < children.length; ci++) {
    var child = children[ci];
    var childPath = (cardPath || '') + '.children.' + ci;
    var prevCount = card.children.length;
    if (child.type === 'top')        await renderTop(card, child);
    if (child.type === 'table')      await renderTable(card, child);
    if (child.type === 'searchbar')  await renderSearchBar(card, child);
    if (child.type === 'filterbar')  await renderFilterBar(card, child);
    if (child.type === 'tab')        await renderTab(card, child);
    if (child.type === 'chipgroup')  await renderChipGroup(card, child);
    if (child.type === 'spinner')    await renderSpinner(card, child);
    if (child.type === 'breadcrumb') await renderBreadcrumb(card, child);
    if (child.type === 'textfield')  await renderTextField(card, child);
    if (child.type === 'textarea')   await renderTextArea(card, child);
    if (child.type === 'checkbox')   await renderCheckbox(card, child);
    if (child.type === 'radio')      await renderRadioButton(card, child);
    if (child.type === 'switch')     await renderSwitch(card, child);
    if (child.type === 'formgroup')  await renderFormGroup(card, child);
    if (child.type === 'iconbutton') await renderIconButton(card, child);
    if (child.type === 'textbutton') await renderTextButton(card, child);
    if (child.type === 'tooltip')    await renderTooltip(card, child);
    if (child.type === 'accordion')   await renderAccordion(card, child);
    if (child.type === 'statusbadge') await renderStatusBadge(card, child);
    if (child.type === 'signal')      await renderSignal(card, child);
    if (child.type === 'custom')      await renderCustom(card, child);
    // card children 태깅
    if (cardPath && card.children.length > prevCount) {
      card.children[card.children.length - 1].setPluginData('jsonPath', childPath);
    }
  }
  return card;
}

// ─── SearchBar ────────────────────────────────────────────────────────────────
async function renderSearchBar(parent, config) {
  var size = config.size || 'medium';
  var key = KEYS.SearchBar[size] !== undefined ? KEYS.SearchBar[size] : KEYS.SearchBar.medium;
  const comp = await figma.importComponentByKeyAsync(key);
  const instance = comp.createInstance();
  parent.appendChild(instance);
  instance.layoutSizingHorizontal = 'FILL';
  return instance;
}

// ─── FilterBar (Dropdown 가로 나열) ──────────────────────────────────────────
async function renderFilterBar(parent, config) {
  const bar = figma.createFrame();
  bar.name = 'Filter Bar';
  bar.layoutMode = 'HORIZONTAL';
  bar.itemSpacing = 8;
  bar.fills = [];
  parent.appendChild(bar);
  bar.layoutSizingHorizontal = 'FILL';
  bar.layoutSizingVertical = 'HUG';

  const dropdowns = config.dropdowns || [];
  for (let i = 0; i < dropdowns.length; i++) {
    const dd = dropdowns[i];
    const comp = await figma.importComponentByKeyAsync(KEYS.Dropdown.medium);
    const instance = comp.createInstance();
    bar.appendChild(instance);

    // placeholder 텍스트 오버라이드
    // Placeholder 텍스트 설정
    try {
      var placeholderNode = instance.findOne(function(n) {
        return n.type === 'TEXT' && n.name === 'Placeholder';
      });
      if (placeholderNode && dd.placeholder) {
        await figma.loadFontAsync(placeholderNode.fontName);
        placeholderNode.characters = dd.placeholder;
      }
    } catch (e) {}

    // Label 제거 후 HUG로 높이 축소
    try {
      instance.setProperties({ 'Label#5242:0': false });
      instance.layoutSizingVertical = 'HUG';
    } catch (e) {}
  }
  return bar;
}

// ─── 컴포넌트별 텍스트 노드 매핑 테이블 ─────────────────────────────────────
// 새 컴포넌트 추가 시: 로그에서 노드 이름 확인 후 여기에만 추가
const TEXT_MAP = {
  textfield: [
    { field: 'label',       matchKey: 'label',  match: function(n) { return n.name === 'Label'; }, nth: 0 },
    { field: 'placeholder', matchKey: 'ph',     match: function(n) { return n.name === 'Placeholder'; } },
    { field: 'helperText',  matchKey: 'helper', match: function(n) { return n.name === 'Helper Text'; } },
  ],
  textarea: [
    { field: 'label',       matchKey: 'label',  match: function(n) { return n.name === 'Label'; }, nth: 0 },
    { field: 'placeholder', matchKey: 'ph',     match: function(n) { return n.name === 'Placeholder'; } },
    { field: 'helperText',  matchKey: 'helper', match: function(n) { return n.name === '0/200'; } },
  ],
  modal: [
    { field: 'title',        matchKey: 'title',  match: function(n) { return n.name.indexOf('제목란') !== -1; } },
    { field: 'description',  matchKey: 'desc',   match: function(n) { return n.name.indexOf('설명란') !== -1; } },
    { field: 'dismissLabel', matchKey: 'button', match: function(n) { return n.name === 'Button'; }, nth: 0 },
    { field: 'ctaLabel',     matchKey: 'button', match: function(n) { return n.name === 'Button'; }, nth: 1 },
  ],
};

// 텍스트 오버라이드 헬퍼
// 1단계: matchKey별로 노드를 그룹핑
// 2단계: 각 rule의 nth 인덱스로 노드 꺼내서 값 쓰기
async function applyTextMap(instance, mapKey, values) {
  var rules = TEXT_MAP[mapKey];
  if (!rules) return;

  var allTexts = instance.findAll(function(n) { return n.type === 'TEXT' && n.visible !== false; });

  // matchKey별로 매칭된 노드 수집
  var grouped = {};
  for (var ti = 0; ti < allTexts.length; ti++) {
    var n = allTexts[ti];
    for (var ri = 0; ri < rules.length; ri++) {
      if (!rules[ri].match(n)) continue;
      var key = rules[ri].matchKey || ('_' + ri);
      if (!grouped[key]) grouped[key] = [];
      if (grouped[key].indexOf(n) === -1) grouped[key].push(n);
      break;
    }
  }

  // rule별로 nth 인덱스 노드에 값 적용
  for (var ri = 0; ri < rules.length; ri++) {
    var rule = rules[ri];
    var val = values[rule.field];
    if (!val) continue;
    var key = rule.matchKey || ('_' + ri);
    var nodes = grouped[key] || [];
    var nth = rule.nth !== undefined ? rule.nth : 0;
    var targetNode = nodes[nth];
    if (!targetNode) continue;
    try {
      await figma.loadFontAsync(targetNode.fontName);
      targetNode.characters = val;
    } catch(e) {}
  }
}

// ─── Tab ─────────────────────────────────────────────────────────────────────
// ─── Modal ────────────────────────────────────────────────────────────────────
async function renderModal(parent, config, W, H) {
  // 어두운 오버레이
  const overlay = figma.createFrame();
  overlay.name = 'Modal Overlay';
  overlay.resize(W, H);
  overlay.x = 0;
  overlay.y = 0;
  overlay.fills = [{ type: 'SOLID', color: TOKENS.black, opacity: 0.5 }];
  overlay.layoutMode = 'NONE';
  parent.appendChild(overlay);

  // title/description 여부에 따라 variant 선택
  var hasTitle = !!(config.title || config.description);
  var key = hasTitle ? KEYS.Modal.withTitle : KEYS.Modal.withoutTitle;
  const comp = await figma.importComponentByKeyAsync(key);
  const instance = comp.createInstance();
  parent.appendChild(instance);

  // title/description boolean 프로퍼티 설정
  try {
    var setObj = {};
    setObj['title#7455:0'] = !!(config.title);
    setObj['description#7455:3'] = !!(config.description);
    instance.setProperties(setObj);
  } catch(e) {}

  // 텍스트 오버라이드
  await applyTextMap(instance, 'modal', config);

  // 화면 중앙 배치
  instance.x = Math.round((W - instance.width) / 2);
  instance.y = Math.round((H - instance.height) / 2);

  return instance;
}

// ─── Custom (Foundation 기반 범용 렌더) ───────────────────────────────────────
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16) / 255,
    g: parseInt(hex.substring(2, 4), 16) / 255,
    b: parseInt(hex.substring(4, 6), 16) / 255,
  };
}

async function renderCustom(parent, config) {
  // type === 'text' → 텍스트 노드
  if (config.type === 'text') {
    var text = figma.createText();
    var fontSize = snapToTypo(config.size || 14);
    var weight = config.weight || (fontSize >= 20 ? 700 : 500);
    var style = weight >= 700 ? 'Bold' : 'Medium';
    await figma.loadFontAsync({ family: 'Pretendard', style: style });
    text.fontName = { family: 'Pretendard', style: style };
    text.fontSize = fontSize;
    text.lineHeight = { value: config.lineHeight || getLineHeight(fontSize), unit: 'PERCENT' };
    text.characters = String(config.value || '');
    // DS Text Style 바인딩 (바인딩 시 font/size/lineHeight 자동 적용)
    await bindTextStyle(text, fontSize, weight);
    if (config.color) {
      text.fills = [{ type: 'SOLID', color: hexToRgb(config.color) }];
      await bindFillByHex(text, config.color, 'fills');
    }
    parent.appendChild(text);
    if (config.fill) {
      text.layoutSizingHorizontal = 'FILL';
    }
    return text;
  }

  // type === 'custom' or 기타 → 프레임
  var frame = figma.createFrame();
  frame.name = config.name || 'Custom';

  // 레이아웃
  var layout = config.layout || 'vertical';
  frame.layoutMode = layout === 'horizontal' ? 'HORIZONTAL' : 'VERTICAL';
  frame.itemSpacing = config.gap !== undefined ? config.gap : 8;

  // 정렬
  if (config.align === 'center') frame.counterAxisAlignItems = 'CENTER';
  if (config.align === 'end') frame.counterAxisAlignItems = 'MAX';
  if (config.justify === 'center') frame.primaryAxisAlignItems = 'CENTER';
  if (config.justify === 'space-between') frame.primaryAxisAlignItems = 'SPACE_BETWEEN';

  // 패딩
  var pad = config.padding;
  if (typeof pad === 'number') {
    frame.paddingTop = pad; frame.paddingBottom = pad;
    frame.paddingLeft = pad; frame.paddingRight = pad;
  } else if (pad && typeof pad === 'object') {
    frame.paddingTop = pad.top || 0; frame.paddingBottom = pad.bottom || 0;
    frame.paddingLeft = pad.left || 0; frame.paddingRight = pad.right || 0;
  }

  // 배경색
  if (config.bg) {
    frame.fills = [{ type: 'SOLID', color: hexToRgb(config.bg) }];
    await bindFillByHex(frame, config.bg, 'fills');
  } else {
    frame.fills = [];
  }

  // 테두리
  if (config.border) {
    frame.strokes = [{ type: 'SOLID', color: hexToRgb(config.border) }];
    await bindFillByHex(frame, config.border, 'strokes');
    frame.strokeWeight = config.borderWidth || 1;
  }

  // 라운드
  if (config.radius) frame.cornerRadius = config.radius;

  // 크기
  parent.appendChild(frame);
  if (config.width === 'fill') {
    frame.layoutSizingHorizontal = 'FILL';
  } else if (config.width) {
    frame.resize(config.width, config.height || 100);
    frame.layoutSizingHorizontal = 'FIXED';
  } else {
    frame.layoutSizingHorizontal = 'FILL';
  }
  frame.layoutSizingVertical = 'HUG';

  // children 재귀
  for (var i = 0; i < (config.children || []).length; i++) {
    await renderCustom(frame, config.children[i]);
  }

  return frame;
}

// ─── TextField ────────────────────────────────────────────────────────────────
async function renderTextField(parent, config) {
  var status = config.status || 'enabled';
  var key = KEYS.TextField[status] !== undefined ? KEYS.TextField[status] : KEYS.TextField.enabled;
  const comp = await figma.importComponentByKeyAsync(key);
  const instance = comp.createInstance();
  parent.appendChild(instance);
  instance.layoutSizingHorizontal = 'FILL';
  await applyTextMap(instance, 'textfield', config);
  return instance;
}

// ─── TextArea ─────────────────────────────────────────────────────────────────
async function renderTextArea(parent, config) {
  var status = config.status || 'enabled';
  var key = KEYS.TextArea[status] !== undefined ? KEYS.TextArea[status] : KEYS.TextArea.enabled;
  const comp = await figma.importComponentByKeyAsync(key);
  const instance = comp.createInstance();
  parent.appendChild(instance);
  instance.layoutSizingHorizontal = 'FILL';
  await applyTextMap(instance, 'textarea', config);
  return instance;
}

// ─── 컨트롤 + 라벨 래퍼 헬퍼 ──────────────────────────────────────────────────
async function renderControlWithLabel(parent, key, label, spacing) {
  if (!label) {
    const comp = await figma.importComponentByKeyAsync(key);
    const instance = comp.createInstance();
    parent.appendChild(instance);
    return instance;
  }
  const row = figma.createFrame();
  row.name = 'Control Row';
  row.layoutMode = 'HORIZONTAL';
  row.itemSpacing = spacing !== undefined ? spacing : 8;
  row.counterAxisAlignItems = 'CENTER';
  row.fills = [];
  parent.appendChild(row);
  row.layoutSizingHorizontal = 'FILL';
  row.layoutSizingVertical = 'HUG';

  const comp = await figma.importComponentByKeyAsync(key);
  const instance = comp.createInstance();
  row.appendChild(instance);

  const text = figma.createText();
  await figma.loadFontAsync({ family: 'Pretendard', style: 'Medium' });
  text.fontName = { family: 'Pretendard', style: 'Medium' };
  text.fontSize = 14;
  text.characters = label;
  await bindTextStyle(text, 14, 500);
  text.fills = [{ type: 'SOLID', color: TOKENS.contentPrimary }];
  await bindFill(text, 'contentPrimary');
  row.appendChild(text);

  return row;
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────
async function renderCheckbox(parent, config) {
  var state = config.selected ? 'selected' : 'unselected';
  if (config.intermediate) state = 'intermediate';
  return await renderControlWithLabel(parent, KEYS.Checkbox[state], config.label, 4);
}

// ─── RadioButton ──────────────────────────────────────────────────────────────
async function renderRadioButton(parent, config) {
  var key = config.selected ? KEYS.RadioButton.selected : KEYS.RadioButton.unselected;
  return await renderControlWithLabel(parent, key, config.label, 4);
}

// ─── Switch ───────────────────────────────────────────────────────────────────
async function renderSwitch(parent, config) {
  var key = config.on ? KEYS.Switch.on : KEYS.Switch.off;
  return await renderControlWithLabel(parent, key, config.label, 8);
}

// ─── FormGroup (폼 필드 세로 나열) ────────────────────────────────────────────
async function renderFormGroup(parent, config) {
  const group = figma.createFrame();
  group.name = config.title || 'Form Group';
  group.layoutMode = 'VERTICAL';
  group.itemSpacing = 12;
  group.fills = [];
  parent.appendChild(group);
  group.layoutSizingHorizontal = 'FILL';
  group.layoutSizingVertical = 'HUG';

  for (var i = 0; i < (config.fields || []).length; i++) {
    var field = config.fields[i];
    if (field.type === 'textfield')    await renderTextField(group, field);
    else if (field.type === 'textarea') await renderTextArea(group, field);
    else if (field.type === 'checkbox') await renderCheckbox(group, field);
    else if (field.type === 'radio')    await renderRadioButton(group, field);
    else if (field.type === 'switch')   await renderSwitch(group, field);
  }
  return group;
}

// ─── IconButton ───────────────────────────────────────────────────────────────
async function renderIconButton(parent, config) {
  var key = KEYS.IconButton.primary;
  const comp = await figma.importComponentByKeyAsync(key);
  const instance = comp.createInstance();
  parent.appendChild(instance);
  return instance;
}

// ─── TextButton ───────────────────────────────────────────────────────────────
async function renderTextButton(parent, config) {
  var key = KEYS.TextButton.enabled;
  const comp = await figma.importComponentByKeyAsync(key);
  const instance = comp.createInstance();
  parent.appendChild(instance);
  var textNode = instance.findOne(function(n) { return n.type === 'TEXT' && n.name === 'Button Text'; });
  if (textNode && config.label) {
    try {
      await figma.loadFontAsync(textNode.fontName);
      textNode.characters = config.label;
    } catch(e) {}
  }
  return instance;
}

// ─── Signal ───────────────────────────────────────────────────────────────────
async function renderSignal(parent, config) {
  var statusMap = {
    'backlog': 'backlog', '대기': 'backlog',
    'in progress': 'inProgress', '처리중': 'inProgress',
    'done': 'done', '완료': 'done',
    'error': 'error', '실패': 'error',
    'pending': 'pending', '보류': 'pending',
  };
  var status = config.status || 'done';
  var mapped = statusMap[status] !== undefined ? statusMap[status] : 'done';
  var key = KEYS.Signal[mapped] !== undefined ? KEYS.Signal[mapped] : KEYS.Signal.done;
  var comp = await figma.importComponentByKeyAsync(key);
  var instance = comp.createInstance();
  parent.appendChild(instance);
  return instance;
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────
async function renderStatusBadge(parent, config) {
  var statusMap = {
    'backlog': 'backlog', '대기': 'backlog',
    'in progress': 'in progress', 'inProgress': 'in progress', '처리중': 'in progress', '진행중': 'in progress',
    'done': 'done', '완료': 'done',
    'error': 'error', '실패': 'error', '에러': 'error',
    'pending': 'pending', '보류': 'pending',
  };
  var status = config.status || 'backlog';
  var mapped = statusMap[status] !== undefined ? statusMap[status] : 'backlog';
  var comp = await figma.importComponentByKeyAsync(KEYS.StatusBadge.backlog);
  var instance = comp.createInstance();
  parent.appendChild(instance);

  // variant 전환
  try {
    var props = instance.componentProperties;
    for (var pName in props) {
      if (pName.toLowerCase().indexOf('status') >= 0) {
        instance.setProperties({ [pName]: mapped });
        break;
      }
    }
  } catch(e) {}

  if (config.label) {
    try { instance.setProperties({ 'label#6829:0': config.label }); } catch(e) {}
  }
  return instance;
}

// ─── Accordion ────────────────────────────────────────────────────────────────
async function renderAccordion(parent, config) {
  var contents = config.contents || 'list';
  var open = config.open !== false;
  var variantKey = contents + (open ? 'Open' : 'Closed');
  var key = KEYS.Accordion[variantKey] !== undefined ? KEYS.Accordion[variantKey] : KEYS.Accordion.listOpen;
  var comp = await figma.importComponentByKeyAsync(key);
  var instance = comp.createInstance();
  parent.appendChild(instance);
  instance.layoutSizingHorizontal = 'FILL';

  // Section Title 오버라이드
  if (config.title) {
    var titleNode = instance.findOne(function(n) { return n.type === 'TEXT' && n.name === 'Section Title'; });
    if (titleNode) {
      try {
        await figma.loadFontAsync(titleNode.fontName);
        titleNode.characters = config.title;
      } catch(e) {}
    }
  }
  return instance;
}

// ─── Dialog ───────────────────────────────────────────────────────────────────
async function renderDialog(parent, config, W, H) {
  // 어두운 오버레이
  var overlay = figma.createFrame();
  overlay.name = 'Dialog Overlay';
  overlay.resize(W, H);
  overlay.x = 0;
  overlay.y = 0;
  overlay.fills = [{ type: 'SOLID', color: TOKENS.black, opacity: 0.5 }];
  overlay.layoutMode = 'NONE';
  parent.appendChild(overlay);

  // variant 결정
  var buttons = config.buttons || [];
  var btnCount = buttons.length || 2;
  var layout = config.layout || 'horizontal';
  var variantKey = 'h2'; // 기본값
  if (layout === 'vertical') {
    variantKey = btnCount >= 3 ? 'v3' : 'v2';
  } else {
    variantKey = btnCount >= 2 ? 'h2' : 'h1';
  }
  var key = KEYS.Dialog[variantKey] !== undefined ? KEYS.Dialog[variantKey] : KEYS.Dialog['h2'];
  var comp = await figma.importComponentByKeyAsync(key);
  var instance = comp.createInstance();
  parent.appendChild(instance);

  // 텍스트 오버라이드 — Title and Description 안의 텍스트, Button Group 안의 버튼
  var allTexts = instance.findAll(function(n) { return n.type === 'TEXT'; });
  // Title = 첫번째 큰 텍스트, Description = 두번째
  var titleSet = false;
  var descSet = false;
  for (var i = 0; i < allTexts.length; i++) {
    var parent2 = allTexts[i].parent;
    if (parent2 && parent2.name === 'Title and Description') {
      if (!titleSet && config.title) {
        try { await figma.loadFontAsync(allTexts[i].fontName); allTexts[i].characters = config.title; } catch(e) {}
        titleSet = true;
      } else if (titleSet && !descSet && config.description) {
        try { await figma.loadFontAsync(allTexts[i].fontName); allTexts[i].characters = config.description; } catch(e) {}
        descSet = true;
      }
    }
  }

  // 버튼 텍스트
  var btnTexts = instance.findAll(function(n) {
    return n.type === 'TEXT' && n.name === 'Button';
  });
  for (var bi = 0; bi < btnTexts.length && bi < buttons.length; bi++) {
    try {
      await figma.loadFontAsync(btnTexts[bi].fontName);
      btnTexts[bi].characters = buttons[bi];
    } catch(e) {}
  }

  // 중앙 배치
  instance.x = Math.round((W - instance.width) / 2);
  instance.y = Math.round((H - instance.height) / 2);

  return instance;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
async function renderToast(parent, config, W) {
  var comp = await figma.importComponentByKeyAsync(KEYS.Toast.text);
  var instance = comp.createInstance();
  parent.appendChild(instance);

  // 텍스트 오버라이드
  if (config.message) {
    var textNodes = instance.findAll(function(n) { return n.type === 'TEXT'; });
    if (textNodes.length > 0) {
      try {
        await figma.loadFontAsync(textNodes[0].fontName);
        textNodes[0].characters = config.message;
      } catch(e) {}
    }
  }

  // 중앙 상단 배치
  if (W) {
    instance.x = Math.round((W - instance.width) / 2);
    instance.y = 40;
  }

  return instance;
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
async function renderTooltip(parent, config) {
  var direction = config.direction || 'bottom-middle';
  var key = KEYS.Tooltip[direction] !== undefined ? KEYS.Tooltip[direction] : KEYS.Tooltip['bottom-middle'];
  const comp = await figma.importComponentByKeyAsync(key);
  const instance = comp.createInstance();
  parent.appendChild(instance);

  // 텍스트 오버라이드
  if (config.text) {
    var textNodes = instance.findAll(function(n) { return n.type === 'TEXT'; });
    for (var i = 0; i < textNodes.length; i++) {
      try {
        await figma.loadFontAsync(textNodes[i].fontName);
        textNodes[i].characters = config.text;
        break;
      } catch(e) {}
    }
  }
  return instance;
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
async function renderChip(parent, config) {
  var key = config.selected ? KEYS.Chip.selected : KEYS.Chip.unselected;
  const comp = await figma.importComponentByKeyAsync(key);
  const instance = comp.createInstance();
  parent.appendChild(instance);
  if (config.label) {
    try { instance.setProperties({ 'label#5658:0': config.label }); } catch(e) {}
  }
  return instance;
}

// ─── ChipGroup (chip 가로 나열) ───────────────────────────────────────────────
async function renderChipGroup(parent, config) {
  const group = figma.createFrame();
  group.name = 'Chip Group';
  group.layoutMode = 'HORIZONTAL';
  group.itemSpacing = 8;
  group.fills = [];
  parent.appendChild(group);
  group.layoutSizingHorizontal = 'FILL';
  group.layoutSizingVertical = 'HUG';

  for (var i = 0; i < (config.items || []).length; i++) {
    var item = config.items[i];
    var label = typeof item === 'string' ? item : item.label;
    var selected = typeof item === 'object' ? !!item.selected : false;
    await renderChip(group, { label: label, selected: selected });
  }
  return group;
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
async function renderSpinner(parent, config) {
  var size = config.size || 32;
  var key = KEYS.Spinner[size] !== undefined ? KEYS.Spinner[size] : KEYS.Spinner[32];
  const comp = await figma.importComponentByKeyAsync(key);
  const instance = comp.createInstance();
  parent.appendChild(instance);
  return instance;
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
// ─── Pagination ───────────────────────────────────────────────────────────────
async function renderPagination(parent, config) {
  const comp = await figma.importComponentByKeyAsync(KEYS.Pagination.center);
  const instance = comp.createInstance();
  parent.appendChild(instance);
  instance.layoutSizingHorizontal = 'FILL';
  return instance;
}

async function renderBreadcrumb(parent, config) {
  const comp = await figma.importComponentByKeyAsync(KEYS.Breadcrumb);
  const instance = comp.createInstance();
  parent.appendChild(instance);
  instance.layoutSizingHorizontal = 'FILL';

  // items가 있으면 Link 텍스트 오버라이드
  var items = config.items || [];
  if (items.length > 0) {
    var linkNodes = instance.findAll(function(n) {
      return n.type === 'TEXT' && n.name === 'Link';
    });
    for (var i = 0; i < linkNodes.length && i < items.length; i++) {
      try {
        await figma.loadFontAsync(linkNodes[i].fontName);
        linkNodes[i].characters = items[i];
      } catch(e) {}
    }
  }
  return instance;
}

async function renderTab(parent, config) {
  const items = config.items || [];
  if (items.length === 0) return;

  const comp = await figma.importComponentByKeyAsync(KEYS.Tab.container);
  const instance = comp.createInstance();
  parent.appendChild(instance);
  instance.layoutSizingHorizontal = 'FILL';

  const tabItems = instance.findAll(function(n) {
    return n.name === 'Tab/item' && n.type === 'INSTANCE';
  });

  for (let i = 0; i < tabItems.length; i++) {
    if (i < items.length) {
      // 텍스트 오버라이드
      const textNode = tabItems[i].findOne(function(n) { return n.type === 'TEXT'; });
      if (textNode) {
        try {
          await figma.loadFontAsync(textNode.fontName);
          textNode.characters = items[i];
        } catch (e) {}
      }
      // activeIndex번째만 selected, 나머지는 unselected
      const activeIndex = config.activeIndex !== undefined ? config.activeIndex : 0;
      const targetKey = i === activeIndex ? KEYS.Tab.selected : KEYS.Tab.unselected;
      const tabComp = await figma.importComponentByKeyAsync(targetKey);
      tabItems[i].swapComponent(tabComp);
    } else {
      tabItems[i].visible = false;
    }
  }
  return instance;
}
