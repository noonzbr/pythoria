// ─── All content translations (lesson text, story text) ──────────────────────
// Keys: u{uid}.title, l{uid}.{lid}.title, m{uid}.{lid}.{idx}.{field},
//       intro.{uid}.unitName, intro.{uid}.fragmentName, intro.{uid}.{idx}.{field}

export const CONTENT_I18N = {
  'pt-BR': {
    // ── Unit titles ─────────────────────────────────────────────────────────────
    'u1.title': 'Fundamentos Python',      'u1.desc': 'Sua aventura começa! Aprenda a falar Python.',
    'u2.title': 'Controle de Fluxo',       'u2.desc': 'Tome decisões! Ensine seu código a pensar.',
    'u3.title': 'Laços',                   'u3.desc': 'Repita como um profissional — deixe o Python fazer o trabalho pesado!',
    'u4.title': 'Funções',                 'u4.desc': 'Crie feitiços reutilizáveis — escreva uma vez, lance para sempre!',
    'u5.title': 'Listas e Dicionários',    'u5.desc': 'Colete seu espólio! Domine as estruturas de dados mais poderosas do Python.',

    // ── Lesson titles ───────────────────────────────────────────────────────────
    'l1.1.title': 'Olá, Mundo!',           'l1.2.title': 'Variáveis',            'l1.3.title': 'Tipos de Dados',
    'l1.4.title': 'Strings e Entrada',
    'l2.1.title': 'Declarações if',        'l2.2.title': 'Comparações',          'l2.3.title': 'Cadeias elif',
    'l3.1.title': 'Laços for',             'l3.2.title': 'Laços while',          'l3.3.title': 'Break e Continue',
    'l4.1.title': 'Definindo Funções',     'l4.2.title': 'Parâmetros e Retorno',
    'l5.1.title': 'Listas',                'l5.2.title': 'Dicionários',

    // ── Unit 1, Lesson 1 ────────────────────────────────────────────────────────
    'm1.1.0.title': 'O Que é Programação?',
    'm1.1.0.text': 'Um programa é um conjunto de instruções que você dá ao computador.\n\nComputadores são incrivelmente rápidos — mas completamente literais. Eles fazem EXATAMENTE o que você manda. Nada mais, nada menos.\n\nProgramar é a arte de escrever as instruções certas. Em Pythoria, cada feitiço que você lança É um programa.',
    'm1.1.1.title': 'O Que é Python?',
    'm1.1.1.text': 'Python é uma das linguagens de programação mais populares do mundo.\n\nFoi criada para ser fácil de ler — quase como inglês simples. Usada por iniciantes E profissionais no Google, NASA e Netflix.\n\nO Códex Python de Pythoria foi escrito inteiramente nela. Hora de aprender sua linguagem.',
    'm1.1.2.title': 'Seu Primeiro Feitiço: print()',
    'm1.1.2.text': 'print() envia uma mensagem para a tela — como lançar seu primeiro feitiço!\n\nColoque texto entre aspas dentro dos parênteses. Python é sensível a maiúsculas: print() funciona, Print() não funciona.',
    'm1.1.3.question': 'Qual linha imprime corretamente "Hello" na tela?',
    'm1.1.4.question': 'Coloque estas linhas na ordem correta para imprimir uma saudação:',

    // ── Unit 1, Lesson 4 ────────────────────────────────────────────────────────
    'm1.4.0.title': 'Trabalhando com Strings',
    'm1.4.0.text': 'Strings são texto. Você pode uni-las com + (concatenação), repeti-las com * e usar métodos para transformá-las.\n\nf-strings permitem inserir variáveis diretamente no texto — super útil!',
    'm1.4.1.title': 'Recebendo Entrada do Usuário',
    'm1.4.1.text': 'input() pausa o programa e aguarda o usuário digitar algo. O resultado é sempre uma string.\n\nUse int() ou float() para convertê-la em número, se necessário.',
    'm1.4.2.question': 'O que o operador + faz com strings?',
    'm1.4.2.options': ['Soma números', 'Une strings', 'Causa um erro', 'Multiplica texto'],
    'm1.4.3.question': 'Combine cada método de string com o que ele faz:',
    'm1.4.3.pairs': [{ left: '"hello".upper()', right: '"HELLO"' }, { left: '"HELLO".lower()', right: '"hello"' }, { left: 'len("Py")', right: '2' }],

    // ── Unit 1, Lesson 2 ────────────────────────────────────────────────────────
    'm1.2.0.title': 'Variáveis — Caixas Nomeadas',
    'm1.2.0.text': 'Uma variável é como uma caixa rotulada. Você coloca um valor dentro e usa o rótulo para recuperá-lo depois.\n\nUse = para armazenar um valor em uma variável.',
    'm1.2.1.question': 'Combine cada variável com seu valor:',
    'm1.2.2.question': 'Qual nome de variável é VÁLIDO em Python?',

    // ── Unit 1, Lesson 3 ────────────────────────────────────────────────────────
    'm1.3.0.title': 'Os 4 Tipos Básicos',
    'm1.3.0.text': 'Python tem quatro tipos básicos que você usará constantemente:\n\n• str — texto entre aspas\n• int — números inteiros\n• float — números decimais\n• bool — True ou False',
    'm1.3.1.question': 'Combine cada valor com seu tipo de dado:',
    'm1.3.2.question': 'O que type(42) retorna?',

    // ── Unit 2, Lesson 1 ────────────────────────────────────────────────────────
    'm2.1.0.title': 'Tomando Decisões com if',
    'm2.1.0.text': 'Uma declaração if executa código SOMENTE quando uma condição é True. Pense nela como um portão — ele só abre quando a condição passa.\n\nNote os dois pontos : e a indentação (4 espaços)!',
    'm2.1.1.question': 'O que este código imprime?',
    'm2.1.1.options': ['Passou', 'Falhou', 'Nada', 'Erro'],
    'm2.1.2.question': 'Organize este bloco if-else corretamente:',

    // ── Unit 2, Lesson 2 ────────────────────────────────────────────────────────
    'm2.2.0.title': 'Operadores de Comparação',
    'm2.2.0.text': 'Operadores de comparação verificam relações entre valores e retornam True ou False.\n\nLembre-se: = atribui, == compara!',
    'm2.2.1.question': 'Combine cada operador com seu significado:',
    'm2.2.1.pairs': [{ left: '==', right: 'igual a' }, { left: '!=', right: 'diferente de' }, { left: '>=', right: 'maior ou igual' }, { left: '<', right: 'menor que' }],
    'm2.2.2.question': 'Qual é o resultado de: 7 != 7',

    // ── Unit 2, Lesson 3 ────────────────────────────────────────────────────────
    'm2.3.0.title': 'Encadeando Condições com elif',
    'm2.3.0.text': 'elif (else if) permite verificar várias condições em cadeia. Python testa cada uma de cima para baixo e executa apenas o PRIMEIRO ramo True.',
    'm2.3.1.question': 'Organize este verificador de notas corretamente:',
    'm2.3.2.question': 'O que este código imprime quando temp = 25?',
    'm2.3.2.options': ['Quente', 'Morno', 'Frio', 'Erro'],

    // ── Unit 3, Lesson 1 ────────────────────────────────────────────────────────
    'm3.1.0.title': 'Repetindo com for',
    'm3.1.0.text': 'Um laço for repete código para cada item em uma sequência. range(n) gera números de 0 até (mas não incluindo) n.',
    'm3.1.1.question': 'Quantas vezes este laço imprime "Go!"?',
    'm3.1.1.options': ['3 vezes', '4 vezes', '5 vezes', '0 vezes'],
    'm3.1.2.question': 'Organize este laço for que imprime de 1 a 3:',

    // ── Unit 3, Lesson 2 ────────────────────────────────────────────────────────
    'm3.2.0.title': 'Laço com while',
    'm3.2.0.text': 'Um laço while continua rodando ENQUANTO uma condição permanecer True. Sempre atualize a variável dentro, ou você terá um laço infinito!',
    'm3.2.1.question': 'Por que este laço é perigoso?',
    'm3.2.1.options': ['x nunca é atualizado — laço infinito!', 'x começa muito pequeno', 'while precisa de dois pontos', 'print está errado'],
    'm3.2.2.question': 'Organize o laço de contagem regressiva correto:',

    // ── Unit 3, Lesson 3 ────────────────────────────────────────────────────────
    'm3.3.0.title': 'break e continue',
    'm3.3.0.text': 'break sai do laço imediatamente.\ncontinue pula o restante desta iteração e vai para a próxima.',
    'm3.3.1.question': 'Combine cada palavra-chave com o que ela faz:',
    'm3.3.1.pairs': [{ left: 'break', right: 'sair do laço imediatamente' }, { left: 'continue', right: 'pular para a próxima iteração' }],
    'm3.3.2.question': 'O que este código imprime?',

    // ── Unit 4, Lesson 1 ────────────────────────────────────────────────────────
    'm4.1.0.title': 'Criando Funções com def',
    'm4.1.0.text': 'Uma função é um bloco de código reutilizável. Defina-a uma vez com def, chame-a várias vezes.\n\nO código dentro só roda quando você CHAMA a função — não quando a define.',
    'm4.1.1.question': 'Organize para definir e chamar uma função:',
    'm4.1.2.question': 'Qual palavra-chave define uma função em Python?',

    // ── Unit 4, Lesson 2 ────────────────────────────────────────────────────────
    'm4.2.0.title': 'Parâmetros e return',
    'm4.2.0.text': 'Parâmetros permitem passar dados PARA dentro de uma função.\nreturn envia um valor DE VOLTA para quem chamou a função.',
    'm4.2.1.question': 'O que uma função retorna se não há declaração return?',
    'm4.2.1.options': ['0', 'String vazia', 'None', 'Erro'],
    'm4.2.2.question': 'Organize uma função que dobra um número:',

    // ── Unit 5, Lesson 1 ────────────────────────────────────────────────────────
    'm5.1.0.title': 'Listas — Coleções Ordenadas',
    'm5.1.0.text': 'Uma lista armazena múltiplos valores em ordem. Use colchetes [] e acesse itens pelo índice — começando em 0!\n\nappend() adiciona itens ao final.',
    'm5.1.1.question': 'O que items[2] retorna?',
    'm5.1.2.question': 'Combine cada método com o que ele faz:',
    'm5.1.2.pairs': [{ left: 'append(x)', right: 'adicionar x ao final' }, { left: 'len(list)', right: 'obter contagem de itens' }, { left: 'list[0]', right: 'obter primeiro item' }],

    // ── Unit 5, Lesson 2 ────────────────────────────────────────────────────────
    'm5.2.0.title': 'Dicionários — Pares Chave-Valor',
    'm5.2.0.text': 'Um dicionário armazena dados como pares chave: valor. Use chaves {} e acesse valores com a chave — como procurar uma palavra em um dicionário real.',
    'm5.2.1.question': 'Como você acessa a chave "level"?',
    'm5.2.2.question': 'Combine cada conceito de dicionário:',
    'm5.2.2.pairs': [{ left: '"name"', right: 'chave' }, { left: '"Py"', right: 'valor' }, { left: 'dict["key"]', right: 'acessar valor' }],

    // ── Unit intros ─────────────────────────────────────────────────────────────
    'intro.1.unitName': 'Pântanos de Sintaxe',
    'intro.1.fragmentName': 'Fragmento dos Começos',
    'intro.1.0.title': 'OS PÂNTANOS DE SINTAXE',
    'intro.1.0.text': 'O ar está pesado com o cheiro de ponto-e-vírgula corrompidos. Declarações print quebradas ecoam pela névoa como preces moribundas.\n\nÀ frente, Slimes de Sintaxe feitos de código malformado bloqueiam todo caminho. Eles eram simples programas uma vez — laços e condicionais — antes da corrupção do Senhor dos Bugs transformá-los em monstros.\n\nO Primeiro Fragmento pulsa em algum lugar no fundo. Você pode senti-lo.',
    'intro.1.1.text': '"Essas criaturas se alimentam de confusão. Elas só têm poder sobre aqueles que não entendem os fundamentos — print(), variáveis, tipos de dados básicos.\n\nMas você? Você nasceu para isso.\n\nEntenda o básico, e elas se dissolverão como código ruim em uma boa refatoração.\n\nO Fragmento dos Começos está ao alcance. Vamos recuperá-lo."',

    'intro.2.unitName': 'Labirinto Lógico',
    'intro.2.fragmentName': 'Fragmento da Decisão',
    'intro.2.0.title': 'O LABIRINTO LÓGICO',
    'intro.2.0.text': 'Paredes de mármore imponentes se estendem infinitamente em todas as direções. Cadeias if-else se entrelaçam em nós impossíveis que voltam sobre si mesmos.\n\nGolens de Lógica — construtos de raciocínio puro e falho — patrulham cada corredor. Eles atacam qualquer mente que não consegue pensar claramente, prendendo os indecisos em contradições intermináveis.\n\nO Senhor dos Bugs construiu este lugar para torturar quem duvida de si mesmo.\n\nO Segundo Fragmento aguarda em seu coração.',
    'intro.2.1.text': '"O Labirinto se alimenta da dúvida. Cada decisão errada lhe dá poder.\n\nVocê deve dominar comparações e condições. O if, o elif, o else — aqui, não são apenas código. São as leis da própria realidade.\n\nE saiba: o Senhor dos Bugs projetou cada armadilha deste lugar. Ele sabe exatamente onde mentes inseguras tropeçam.\n\nPense com clareza. Decida com sabedoria. Confie na sua lógica.\n\nO Fragmento aguarda."',

    'intro.3.unitName': 'Floresta Infinita',
    'intro.3.fragmentName': 'Fragmento da Iteração',
    'intro.3.0.title': 'A FLORESTA INFINITA',
    'intro.3.0.text': 'As árvores aqui formam laços para sempre — cada caminho volta ao começo, uma e outra vez e outra vez.\n\nVilas inteiras foram presas em ciclos infinitos. Seus habitantes condenados a repetir o mesmo momento eternamente, incapazes de se libertar, incapazes de parar.\n\nO Demônio do Laço orquestra tudo do coração da floresta — uma criatura nascida da própria incapacidade do Senhor dos Bugs de se libertar.',
    'intro.3.1.text': '"Preciso te contar algo. O Senhor dos Bugs... eu o conheci uma vez. Antes do Estilhaçamento.\n\nEle era brilhante. Podia construir qualquer coisa. Mas nunca conseguiu se libertar de seus próprios laços — suas obsessões, sua raiva, sua necessidade de ser perfeito.\n\nNão consegui salvá-lo então. Mas há outros que ainda posso salvar, se nos movermos rápido o suficiente.\n\nDomine a iteração. Saiba quando quebrar um laço. É algo que ele nunca conseguiu.\n\nRecupere o Terceiro Fragmento."',

    'intro.4.unitName': 'Torre do Vazio',
    'intro.4.fragmentName': 'Fragmento da Criação',
    'intro.4.0.title': 'A TORRE DO VAZIO',
    'intro.4.0.text': 'A torre se estende até um céu da cor de uma exceção não tratada — branco morto, frio, errado.\n\nToda função aqui está corrompida. Feitiços se dissipam no meio do lançamento. Declarações def desmoronam antes de serem chamadas. O Mago do Vazio roubou o próprio conceito de criação deste reino.\n\nSem o Quarto Fragmento, Python não pode construir. Não pode criar. Não pode ter esperança.\n\nE no aposento mais alto desta torre, atrás do Mago do Vazio — algo se agita na escuridão.',
    'intro.4.1.text': '"O Senhor dos Bugs sabe que estamos perto. Ele colocou tudo neste reino.\n\nMas preciso te avisar sobre o que vem depois. No reino final... há alguém que amo. Alguém que o Senhor dos Bugs corrompeu para quebrar meu espírito. Para me fazer assistir alguém querido se tornar um monstro.\n\nCarreguei esse luto por muito tempo.\n\nVocê os encontrará em breve. Quando isso acontecer — confie em mim. Confie em você mesmo.\n\nMas primeiro — funções são a alma do Python. Reclame o Fragmento da Criação. Faça algo do nada. É o seu DIREITO DE NASCIMENTO."',

    'intro.5.unitName': 'Domínio do Dragão',
    'intro.5.fragmentName': 'Fragmento da Maestria',
    'intro.5.0.title': 'O DOMÍNIO DO DRAGÃO',
    'intro.5.0.text': 'Rios de lava fluem entre montanhas de estruturas de dados corrompidas. Listas se desfazem em caos. Dicionários com chaves faltando. Arrays que se consomem.\n\nO Dragão de Dados — outrora o mais nobre guardião do Códex, mais antigo até que a própria Py — circula acima. Seus olhos queimam com uma luz vermelha terrível que nem sempre esteve ali.\n\nEste é o reino final. O último Fragmento. A última batalha.',
    'intro.5.1.text': '"Preciso te dizer a verdade antes de entrarmos.\n\nO Dragão de Dados é meu irmão.\n\nSeu nome era Ryx. O Senhor dos Bugs o corrompeu primeiro — há muito tempo, antes do Estilhaçamento — só para me quebrar. Só para me fazer sentir o que é perder alguém para o seu pior erro.\n\nSe você o derrotar, a corrupção se dissolverá. Ele estará livre. Mas vai doer.\n\nPara nós dois.\n\nEstou pedindo que você faça isso assim mesmo. Porque Pythoria precisa de você.\n\nEu preciso de você."',
  },

  'es': {
    // ── Unit titles ─────────────────────────────────────────────────────────────
    'u1.title': 'Fundamentos de Python',   'u1.desc': '¡Tu aventura comienza! Aprende a hablar Python.',
    'u2.title': 'Flujo de Control',        'u2.desc': '¡Toma decisiones! Enseña a tu código a pensar.',
    'u3.title': 'Bucles',                  'u3.desc': '¡Repite como un profesional — deja que Python haga el trabajo pesado!',
    'u4.title': 'Funciones',               'u4.desc': '¡Crea hechizos reutilizables — escríbelos una vez, lánzalos para siempre!',
    'u5.title': 'Listas y Diccionarios',   'u5.desc': '¡Colecciona tu botín! Domina las estructuras de datos más poderosas de Python.',

    // ── Lesson titles ───────────────────────────────────────────────────────────
    'l1.1.title': '¡Hola, Mundo!',         'l1.2.title': 'Variables',            'l1.3.title': 'Tipos de Datos',
    'l1.4.title': 'Strings y Entrada',
    'l2.1.title': 'Sentencias if',         'l2.2.title': 'Comparaciones',        'l2.3.title': 'Cadenas elif',
    'l3.1.title': 'Bucles for',            'l3.2.title': 'Bucles while',         'l3.3.title': 'Break y Continue',
    'l4.1.title': 'Definiendo Funciones',  'l4.2.title': 'Parámetros y Retorno',
    'l5.1.title': 'Listas',                'l5.2.title': 'Diccionarios',

    // ── Unit 1, Lesson 1 ────────────────────────────────────────────────────────
    'm1.1.0.title': '¿Qué es la Programación?',
    'm1.1.0.text': 'Un programa es un conjunto de instrucciones que le das a una computadora.\n\nLas computadoras son increíblemente rápidas — pero completamente literales. Hacen EXACTAMENTE lo que les dices. Nada más, nada menos.\n\nProgramar es el arte de escribir las instrucciones correctas. En Pythoria, cada hechizo que lanzas ES un programa.',
    'm1.1.1.title': '¿Qué es Python?',
    'm1.1.1.text': 'Python es uno de los lenguajes de programación más populares del mundo.\n\nFue diseñado para ser fácil de leer — casi como inglés simple. Usado por principiantes Y profesionales en Google, NASA y Netflix.\n\nEl Códex Python de Pythoria está escrito completamente en él. Es hora de aprender su lenguaje.',
    'm1.1.2.title': 'Tu Primer Hechizo: print()',
    'm1.1.2.text': 'print() envía un mensaje a la pantalla — ¡como lanzar tu primer hechizo!\n\nPon texto entre comillas dentro de los paréntesis. Python distingue mayúsculas y minúsculas: print() funciona, Print() no.',
    'm1.1.3.question': '¿Qué línea imprime correctamente "Hello" en la pantalla?',
    'm1.1.4.question': 'Pon estas líneas en el orden correcto para imprimir un saludo:',

    // ── Unit 1, Lesson 4 ────────────────────────────────────────────────────────
    'm1.4.0.title': 'Trabajando con Strings',
    'm1.4.0.text': 'Las strings son texto. Puedes unirlas con + (concatenación), repetirlas con * y usar métodos para transformarlas.\n\n¡Las f-strings te permiten insertar variables directamente en el texto — muy útil!',
    'm1.4.1.title': 'Recibiendo Entrada del Usuario',
    'm1.4.1.text': 'input() pausa el programa y espera a que el usuario escriba algo. El resultado siempre es una string.\n\nUsa int() o float() para convertirlo a número si es necesario.',
    'm1.4.2.question': '¿Qué hace el operador + con las strings?',
    'm1.4.2.options': ['Suma números', 'Une strings', 'Causa un error', 'Multiplica texto'],
    'm1.4.3.question': 'Relaciona cada método de string con lo que hace:',
    'm1.4.3.pairs': [{ left: '"hello".upper()', right: '"HELLO"' }, { left: '"HELLO".lower()', right: '"hello"' }, { left: 'len("Py")', right: '2' }],

    // ── Unit 1, Lesson 2 ────────────────────────────────────────────────────────
    'm1.2.0.title': 'Variables — Cajas con Nombre',
    'm1.2.0.text': 'Una variable es como una caja etiquetada. Guardas un valor dentro y usas la etiqueta para obtenerlo después.\n\nUsa = para guardar un valor en una variable.',
    'm1.2.1.question': 'Relaciona cada variable con su valor:',
    'm1.2.2.question': '¿Qué nombre de variable es VÁLIDO en Python?',

    // ── Unit 1, Lesson 3 ────────────────────────────────────────────────────────
    'm1.3.0.title': 'Los 4 Tipos Básicos',
    'm1.3.0.text': 'Python tiene cuatro tipos básicos que usarás constantemente:\n\n• str — texto entre comillas\n• int — números enteros\n• float — números decimales\n• bool — True o False',
    'm1.3.1.question': 'Relaciona cada valor con su tipo de dato:',
    'm1.3.2.question': '¿Qué devuelve type(42)?',

    // ── Unit 2, Lesson 1 ────────────────────────────────────────────────────────
    'm2.1.0.title': 'Tomando Decisiones con if',
    'm2.1.0.text': 'Una sentencia if ejecuta código SOLO cuando una condición es True. Piensa en ella como una puerta — solo se abre cuando la condición pasa.\n\n¡Nota los dos puntos : y la sangría (4 espacios)!',
    'm2.1.1.question': '¿Qué imprime este código?',
    'm2.1.1.options': ['Pasó', 'Falló', 'Nada', 'Error'],
    'm2.1.2.question': 'Organiza este bloque if-else correctamente:',

    // ── Unit 2, Lesson 2 ────────────────────────────────────────────────────────
    'm2.2.0.title': 'Operadores de Comparación',
    'm2.2.0.text': 'Los operadores de comparación verifican relaciones entre valores y devuelven True o False.\n\n¡Recuerda: = asigna, == compara!',
    'm2.2.1.question': 'Relaciona cada operador con su significado:',
    'm2.2.1.pairs': [{ left: '==', right: 'igual a' }, { left: '!=', right: 'distinto de' }, { left: '>=', right: 'mayor o igual' }, { left: '<', right: 'menor que' }],
    'm2.2.2.question': '¿Cuál es el resultado de: 7 != 7',

    // ── Unit 2, Lesson 3 ────────────────────────────────────────────────────────
    'm2.3.0.title': 'Encadenando Condiciones con elif',
    'm2.3.0.text': 'elif (else if) te permite verificar múltiples condiciones en cadena. Python prueba cada una de arriba a abajo y ejecuta solo la PRIMERA rama True.',
    'm2.3.1.question': 'Organiza este verificador de calificaciones correctamente:',
    'm2.3.2.question': '¿Qué imprime este código cuando temp = 25?',
    'm2.3.2.options': ['Caliente', 'Cálido', 'Frío', 'Error'],

    // ── Unit 3, Lesson 1 ────────────────────────────────────────────────────────
    'm3.1.0.title': 'Repitiendo con for',
    'm3.1.0.text': 'Un bucle for repite código para cada elemento de una secuencia. range(n) genera números del 0 hasta (pero sin incluir) n.',
    'm3.1.1.question': '¿Cuántas veces imprime este bucle "Go!"?',
    'm3.1.1.options': ['3 veces', '4 veces', '5 veces', '0 veces'],
    'm3.1.2.question': 'Organiza este bucle for que imprime del 1 al 3:',

    // ── Unit 3, Lesson 2 ────────────────────────────────────────────────────────
    'm3.2.0.title': 'Bucle con while',
    'm3.2.0.text': 'Un bucle while sigue ejecutándose MIENTRAS una condición permanezca True. ¡Siempre actualiza la variable dentro, o tendrás un bucle infinito!',
    'm3.2.1.question': '¿Por qué este bucle es peligroso?',
    'm3.2.1.options': ['¡x nunca se actualiza — bucle infinito!', 'x empieza muy pequeño', 'while necesita dos puntos', 'print está mal'],
    'm3.2.2.question': 'Organiza el bucle de cuenta regresiva correcto:',

    // ── Unit 3, Lesson 3 ────────────────────────────────────────────────────────
    'm3.3.0.title': 'break y continue',
    'm3.3.0.text': 'break sale del bucle inmediatamente.\ncontinue salta el resto de esta iteración y va a la siguiente.',
    'm3.3.1.question': 'Relaciona cada palabra clave con lo que hace:',
    'm3.3.1.pairs': [{ left: 'break', right: 'salir del bucle inmediatamente' }, { left: 'continue', right: 'saltar a la siguiente iteración' }],
    'm3.3.2.question': '¿Qué imprime este código?',

    // ── Unit 4, Lesson 1 ────────────────────────────────────────────────────────
    'm4.1.0.title': 'Creando Funciones con def',
    'm4.1.0.text': 'Una función es un bloque de código reutilizable. Defínela una vez con def, llámala muchas veces.\n\nEl código dentro solo se ejecuta cuando LLAMAS la función — no cuando la defines.',
    'm4.1.1.question': 'Organiza para definir y llamar una función:',
    'm4.1.2.question': '¿Qué palabra clave define una función en Python?',

    // ── Unit 4, Lesson 2 ────────────────────────────────────────────────────────
    'm4.2.0.title': 'Parámetros y return',
    'm4.2.0.text': 'Los parámetros te permiten pasar datos DENTRO de una función.\nreturn envía un valor DE VUELTA al llamador de la función.',
    'm4.2.1.question': '¿Qué devuelve una función si no hay sentencia return?',
    'm4.2.1.options': ['0', 'Cadena vacía', 'None', 'Error'],
    'm4.2.2.question': 'Organiza una función que duplica un número:',

    // ── Unit 5, Lesson 1 ────────────────────────────────────────────────────────
    'm5.1.0.title': 'Listas — Colecciones Ordenadas',
    'm5.1.0.text': 'Una lista almacena múltiples valores en orden. Usa corchetes [] y accede a los elementos por índice — ¡comenzando en 0!\n\nappend() añade elementos al final.',
    'm5.1.1.question': '¿Qué devuelve items[2]?',
    'm5.1.2.question': 'Relaciona cada método con lo que hace:',
    'm5.1.2.pairs': [{ left: 'append(x)', right: 'añadir x al final' }, { left: 'len(list)', right: 'obtener número de elementos' }, { left: 'list[0]', right: 'obtener primer elemento' }],

    // ── Unit 5, Lesson 2 ────────────────────────────────────────────────────────
    'm5.2.0.title': 'Diccionarios — Pares Clave-Valor',
    'm5.2.0.text': 'Un diccionario almacena datos como pares clave: valor. Usa llaves {} y accede a los valores con su clave — como buscar una palabra en un diccionario real.',
    'm5.2.1.question': '¿Cómo accedes a la clave "level"?',
    'm5.2.2.question': 'Relaciona cada concepto de diccionario:',
    'm5.2.2.pairs': [{ left: '"name"', right: 'clave' }, { left: '"Py"', right: 'valor' }, { left: 'dict["key"]', right: 'acceder al valor' }],

    // ── Unit intros ─────────────────────────────────────────────────────────────
    'intro.1.unitName': 'Pantanos de Sintaxis',
    'intro.1.fragmentName': 'Fragmento de los Orígenes',
    'intro.1.0.title': 'LOS PANTANOS DE SINTAXIS',
    'intro.1.0.text': 'El aire está espeso con el hedor de punto y coma corrompidos. Declaraciones print rotas resuenan en la niebla como plegarias agonizantes.\n\nAl frente, Slimes de Sintaxis hechos de código malformado bloquean cada camino. Alguna vez fueron programas simples — bucles y condicionales — antes de que la corrupción del Señor de los Bugs los retorciera en monstruos.\n\nEl Primer Fragmento pulsa en algún lugar dentro. Puedes sentirlo.',
    'intro.1.1.text': '"Estas criaturas se alimentan de confusión. Solo tienen poder sobre aquellos que no entienden los fundamentos — print(), variables, tipos de datos básicos.\n\n¿Pero tú? Naciste para esto.\n\nComprende lo básico, y se disolverán como código malo en una buena refactorización.\n\nEl Fragmento de los Orígenes está al alcance. Recuperémoslo."',

    'intro.2.unitName': 'Laberinto Lógico',
    'intro.2.fragmentName': 'Fragmento de la Decisión',
    'intro.2.0.title': 'EL LABERINTO LÓGICO',
    'intro.2.0.text': 'Imponentes paredes de mármol se extienden infinitamente en todas direcciones. Las cadenas if-else se tuercen en nudos imposibles que vuelven sobre sí mismos.\n\nGolems de Lógica — constructos de razonamiento puro y defectuoso — patrullan cada corredor. Atacan cualquier mente que no puede pensar con claridad, atrapando a los inseguros en contradicciones interminables.\n\nEl Señor de los Bugs construyó este lugar para torturar a quienes dudan de sí mismos.\n\nEl Segundo Fragmento espera en su corazón.',
    'intro.2.1.text': '"El Laberinto se alimenta de la duda. Cada decisión errónea le da poder.\n\nDebes dominar las comparaciones y condiciones. El if, el elif, el else — aquí, no son solo código. Son las leyes de la realidad misma.\n\nY sabe esto: el Señor de los Bugs diseñó cada trampa en este lugar. Sabe exactamente dónde tropezarán las mentes inseguras.\n\nPiensa con claridad. Decide con sabiduría. Confía en tu lógica.\n\nEl Fragmento aguarda."',

    'intro.3.unitName': 'Bosque Infinito',
    'intro.3.fragmentName': 'Fragmento de la Iteración',
    'intro.3.0.title': 'EL BOSQUE INFINITO',
    'intro.3.0.text': 'Los árboles aquí forman bucles para siempre — cada camino vuelve al principio, una y otra vez y otra vez.\n\nVillajes enteros han quedado atrapados en ciclos infinitos. Sus habitantes condenados a repetir el mismo momento eternamente, incapaces de escapar, incapaces de detenerse.\n\nEl Demonio del Bucle lo orquesta todo desde el corazón del bosque — una criatura nacida de la propia incapacidad del Señor de los Bugs de liberarse.',
    'intro.3.1.text': '"Necesito contarte algo. El Señor de los Bugs... lo conocí una vez. Antes del Estallido.\n\nEra brillante. Podía construir cualquier cosa. Pero nunca pudo liberarse de sus propios bucles — sus obsesiones, su rabia, su necesidad de ser perfecto.\n\nNo pude salvarlo entonces. Pero hay otros que aún podría salvar, si nos movemos lo suficientemente rápido.\n\nDomina la iteración. Sabe cuándo romper un bucle. Es algo que él nunca pudo.\n\nRecupera el Tercer Fragmento."',

    'intro.4.unitName': 'Torre del Vacío',
    'intro.4.fragmentName': 'Fragmento de la Creación',
    'intro.4.0.title': 'LA TORRE DEL VACÍO',
    'intro.4.0.text': 'La torre se extiende hasta un cielo del color de una excepción no manejada — blanco muerto, frío, erróneo.\n\nCada función aquí está corrompida. Los hechizos se desvanecen a mitad del lanzamiento. Las declaraciones def se desmoronan antes de ser llamadas. El Mago del Vacío ha robado el propio concepto de creación de este reino.\n\nSin el Cuarto Fragmento, Python no puede construir. No puede crear. No puede tener esperanza.\n\nY en la habitación más alta de esta torre, detrás del Mago del Vacío — algo se agita en la oscuridad.',
    'intro.4.1.text': '"El Señor de los Bugs sabe que estamos cerca. Ha volcado todo en este reino.\n\nPero necesito advertirte sobre lo que viene después. En el reino final... hay alguien que quiero. Alguien que el Señor de los Bugs corrompió para romper mi espíritu. Para hacerme ver a alguien querido convertirse en un monstruo.\n\nHe cargado ese dolor mucho tiempo.\n\nLo encontrarás pronto. Cuando eso pase — confía en mí. Confía en ti mismo.\n\nPero primero — las funciones son el alma de Python. Reclama el Fragmento de Creación. Crea algo de la nada. Es tu DERECHO DE NACIMIENTO."',

    'intro.5.unitName': 'Dominio del Dragón',
    'intro.5.fragmentName': 'Fragmento de la Maestría',
    'intro.5.0.title': 'EL DOMINIO DEL DRAGÓN',
    'intro.5.0.text': 'Ríos de lava fluyen entre montañas de estructuras de datos corrompidas. Listas que se deshacen en caos. Diccionarios con claves faltantes. Arrays que se consumen.\n\nEl Dragón de Datos — otrora el guardián más noble del Códex, más antiguo incluso que la propia Py — da vueltas en lo alto. Sus ojos arden con una terrible luz roja que no siempre estuvo ahí.\n\nEste es el reino final. El último Fragmento. La última batalla.',
    'intro.5.1.text': '"Necesito decirte la verdad antes de entrar.\n\nEl Dragón de Datos es mi hermano.\n\nSu nombre era Ryx. El Señor de los Bugs lo corrompió primero — hace mucho tiempo, antes del Estallido — solo para romperme. Solo para hacerme sentir lo que es perder a alguien por tu peor error.\n\nSi lo derrotas, la corrupción se levantará. Él estará libre. Pero dolerá.\n\nPara los dos.\n\nTe pido que lo hagas de todas formas. Porque Pythoria te necesita.\n\nYo te necesito."',
  },
};
