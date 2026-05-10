import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Plus, Minus, Search, X } from 'lucide-react';

interface StickerState {
  [key: string]: number;
}

const grupos = {
  A: ['México', 'África do Sul', 'Coreia do Sul', 'República Tcheca'],
  B: ['Canadá', 'Bósnia', 'Catar', 'Suíça'],
  C: ['Brasil', 'Marrocos', 'Haiti', 'Escócia'],
  D: ['Estados Unidos', 'Paraguai', 'Austrália', 'Turquia'],
  E: ['Alemanha', 'Curaçao', 'Costa do Marfim', 'Equador'],
  F: ['Holanda', 'Japão', 'Suécia', 'Tunísia'],
  G: ['Bélgica', 'Egito', 'Irã', 'Nova Zelândia'],
  H: ['Espanha', 'Cabo Verde', 'Arábia Saudita', 'Uruguai'],
  I: ['França', 'Senegal', 'Iraque', 'Noruega'],
  J: ['Argentina', 'Argélia', 'Áustria', 'Jordânia'],
  K: ['Portugal', 'RD Congo', 'Uzbequistão', 'Colômbia'],
  L: ['Inglaterra', 'Croácia', 'Gana', 'Panamá']
};

export default function App() {
  const [stickers, setStickers] = useState<StickerState>({});
  const [activeTab, setActiveTab] = useState<'fwc' | 'grupos' | 'coca'>('fwc');
  const [activeGroup, setActiveGroup] = useState<keyof typeof grupos>('A');
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('album-figurinhas');
    if (saved) {
      setStickers(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('album-figurinhas', JSON.stringify(stickers));
  }, [stickers]);

  const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[̀-ͯ]/g, '');
  };

  const incrementSticker = (id: string) => {
    setStickers(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const decrementSticker = (id: string) => {
    setStickers(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }));
  };

  const getProgress = (ids: string[]) => {
    const total = ids.length;
    const filled = ids.filter(id => (stickers[id] || 0) > 0).length;
    return { filled, total, percent: Math.round((filled / total) * 100) };
  };

  const fwcIds = Array.from({ length: 20 }, (_, i) => `fwc-${i.toString().padStart(2, '0')}`);
  const cocaIds = Array.from({ length: 14 }, (_, i) => `coca-${i + 1}`);

  const allGroupIds = Object.keys(grupos).flatMap(grupo =>
    grupos[grupo as keyof typeof grupos].flatMap(selecao =>
      Array.from({ length: 20 }, (_, i) => `${grupo}-${selecao}-${i + 1}`)
    )
  );

  const totalIds = [...fwcIds, ...allGroupIds, ...cocaIds];
  const globalProgress = getProgress(totalIds);

  const getTotalStickers = () => {
    return Object.values(stickers).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B1538] via-[#6B1028] to-[#4B0818] text-white flex justify-center">
      <div className="w-full max-w-[430px] flex flex-col">
        {/* Header */}
        <div className="bg-[#8B1538] p-4 shadow-lg sticky top-0 z-10">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h1 className="text-white">Álbum Copa do Mundo</h1>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{globalProgress.filled}/{globalProgress.total}</span>
            </div>
            <div className="w-full bg-[#4B0818] rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${globalProgress.percent}%` }}
              />
            </div>
            <div className="flex justify-between text-sm pt-1">
              <span>Total de Figurinhas</span>
              <span className="text-yellow-400 font-medium">{getTotalStickers()}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#6B1028] flex border-b border-[#4B0818]">
          <button
            onClick={() => setActiveTab('fwc')}
            className={`flex-1 py-3 transition-colors ${
              activeTab === 'fwc' ? 'bg-[#8B1538] border-b-2 border-yellow-400' : 'hover:bg-[#7B1532]'
            }`}
          >
            FWC (00-19)
          </button>
          <button
            onClick={() => setActiveTab('grupos')}
            className={`flex-1 py-3 transition-colors ${
              activeTab === 'grupos' ? 'bg-[#8B1538] border-b-2 border-yellow-400' : 'hover:bg-[#7B1532]'
            }`}
          >
            Grupos
          </button>
          <button
            onClick={() => setActiveTab('coca')}
            className={`flex-1 py-3 transition-colors ${
              activeTab === 'coca' ? 'bg-[#8B1538] border-b-2 border-yellow-400' : 'hover:bg-[#7B1532]'
            }`}
          >
            Coca-Cola
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'fwc' && (
            <StickerSection
              title="Figurinhas FWC"
              ids={fwcIds}
              stickers={stickers}
              onIncrement={incrementSticker}
              onDecrement={decrementSticker}
              getProgress={getProgress}
            />
          )}

          {activeTab === 'coca' && (
            <StickerSection
              title="Figurinhas Coca-Cola"
              ids={cocaIds}
              stickers={stickers}
              onIncrement={incrementSticker}
              onDecrement={decrementSticker}
              getProgress={getProgress}
            />
          )}

          {activeTab === 'grupos' && (
            <>
              {/* Group Navigation */}
              <div className="mb-4 flex items-center justify-between bg-[#6B1028] p-3 rounded-lg">
                <button
                  onClick={() => {
                    const keys = Object.keys(grupos) as Array<keyof typeof grupos>;
                    const currentIndex = keys.indexOf(activeGroup);
                    const newIndex = currentIndex > 0 ? currentIndex - 1 : keys.length - 1;
                    setActiveGroup(keys[newIndex]);
                  }}
                  className="p-2 hover:bg-[#8B1538] rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowGroupSelector(true)}
                  className="flex-1 text-center hover:bg-[#8B1538] rounded-lg transition-colors py-1"
                >
                  <div className="text-yellow-400 font-medium">GRUPO {activeGroup}</div>
                  <div className="text-sm opacity-90">
                    {(() => {
                      const groupIds = grupos[activeGroup].flatMap(selecao =>
                        Array.from({ length: 20 }, (_, i) => `${activeGroup}-${selecao}-${i + 1}`)
                      );
                      const progress = getProgress(groupIds);
                      return `${progress.filled}/${progress.total}`;
                    })()}
                  </div>
                </button>
                <button
                  onClick={() => {
                    const keys = Object.keys(grupos) as Array<keyof typeof grupos>;
                    const currentIndex = keys.indexOf(activeGroup);
                    const newIndex = currentIndex < keys.length - 1 ? currentIndex + 1 : 0;
                    setActiveGroup(keys[newIndex]);
                  }}
                  className="p-2 hover:bg-[#8B1538] rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Search Field */}
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Pesquisar seleção..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#6B1028] rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Teams in Group */}
              <div className="space-y-4">
                {searchQuery ? (
                  // Show filtered results from all groups
                  <>
                    {Object.entries(grupos).flatMap(([grupo, selecoes]) =>
                      selecoes
                        .filter(selecao =>
                          removeAccents(selecao.toLowerCase()).includes(removeAccents(searchQuery.toLowerCase()))
                        )
                        .map(selecao => {
                          const teamIds = Array.from({ length: 20 }, (_, i) => `${grupo}-${selecao}-${i + 1}`);
                          return (
                            <StickerSection
                              key={`${grupo}-${selecao}`}
                              title={`${selecao} (Grupo ${grupo})`}
                              ids={teamIds}
                              stickers={stickers}
                              onIncrement={incrementSticker}
                              onDecrement={decrementSticker}
                              getProgress={getProgress}
                            />
                          );
                        })
                    )}
                    {Object.entries(grupos).flatMap(([, selecoes]) =>
                      selecoes.filter(selecao =>
                        removeAccents(selecao.toLowerCase()).includes(removeAccents(searchQuery.toLowerCase()))
                      )
                    ).length === 0 && (
                      <div className="text-center py-8 text-white/60">
                        Nenhuma seleção encontrada
                      </div>
                    )}
                  </>
                ) : (
                  // Show current group
                  grupos[activeGroup].map((selecao) => {
                    const teamIds = Array.from({ length: 20 }, (_, i) => `${activeGroup}-${selecao}-${i + 1}`);
                    return (
                      <StickerSection
                        key={`${activeGroup}-${selecao}`}
                        title={selecao}
                        ids={teamIds}
                        stickers={stickers}
                        onIncrement={incrementSticker}
                        onDecrement={decrementSticker}
                        getProgress={getProgress}
                      />
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Group Selector Modal */}
        {showGroupSelector && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowGroupSelector(false)}
          >
            <div
              className="bg-[#6B1028] rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-yellow-400 mb-4 text-center">Selecione o Grupo</h2>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(grupos) as Array<keyof typeof grupos>).map((grupo) => {
                  const groupIds = grupos[grupo].flatMap(selecao =>
                    Array.from({ length: 20 }, (_, i) => `${grupo}-${selecao}-${i + 1}`)
                  );
                  const progress = getProgress(groupIds);
                  const isActive = grupo === activeGroup;

                  return (
                    <button
                      key={grupo}
                      onClick={() => {
                        setActiveGroup(grupo);
                        setShowGroupSelector(false);
                      }}
                      className={`p-4 rounded-lg transition-all ${
                        isActive
                          ? 'bg-yellow-400 text-[#6B1028]'
                          : 'bg-[#8B1538] hover:bg-[#9B1648]'
                      }`}
                    >
                      <div className={`text-lg font-bold mb-1 ${isActive ? '' : 'text-yellow-400'}`}>
                        {grupo}
                      </div>
                      <div className="text-xs opacity-90">
                        {progress.filled}/{progress.total}
                      </div>
                      <div className="w-full bg-black/20 rounded-full h-1 mt-2">
                        <div
                          className={`h-1 rounded-full transition-all ${
                            isActive ? 'bg-[#6B1028]' : 'bg-green-400'
                          }`}
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setShowGroupSelector(false)}
                className="w-full mt-4 py-3 bg-[#8B1538] hover:bg-[#9B1648] rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface StickerSectionProps {
  title: string;
  ids: string[];
  stickers: StickerState;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  getProgress: (ids: string[]) => { filled: number; total: number; percent: number };
}

function StickerSection({ title, ids, stickers, onIncrement, onDecrement, getProgress }: StickerSectionProps) {
  const progress = getProgress(ids);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-yellow-400">{title}</h3>
          <span className="text-sm">{progress.filled}/{progress.total}</span>
        </div>
        <div className="w-full bg-[#4B0818] rounded-full h-1.5">
          <div
            className="bg-green-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {ids.map((id) => {
          const count = stickers[id] || 0;
          const label = id.includes('fwc-')
            ? id.replace('fwc-', '')
            : id.includes('coca-')
            ? id.replace('coca-', '')
            : id.split('-').pop() || '';

          return (
            <div
              key={id}
              className={`rounded-lg overflow-hidden transition-all ${
                count > 0
                  ? 'bg-green-500/90 shadow-lg shadow-green-500/30'
                  : 'bg-white/20'
              }`}
            >
              <div className="text-center py-2">
                <div className="text-sm font-medium">{label}</div>
                {count > 0 && (
                  <div className="text-lg font-bold">{count}</div>
                )}
              </div>
              <div className="flex border-t border-white/20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDecrement(id);
                  }}
                  className="flex-1 py-1.5 bg-red-500/80 hover:bg-red-500 active:bg-red-600 transition-colors flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onIncrement(id);
                  }}
                  className="flex-1 py-1.5 bg-blue-500/80 hover:bg-blue-500 active:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
