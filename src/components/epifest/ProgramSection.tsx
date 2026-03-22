import { useState, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Coffee, Globe } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface ScheduleItem {
  id: string;
  day: number;
  block_name: string;
  talk_title: string;
  topic: string;
  speaker: string;
  time_arg: string;
  display_order: number;
  is_break: boolean;
}

// ── Timezones ─────────────────────────────────────────────────────────────────
const TIMEZONE_OFFSETS = [
  { label: '🇦🇷 ARG',    offset: 0  },
  { label: '🇨🇱 Chile',   offset: -1 },
  { label: '🇨🇴 COL/PER', offset: -2 },
  { label: '🇲🇽 MÉX',    offset: -3 },
];

function convertTime(timeArg: string, offsetHours: number): string {
  if (!timeArg) return '';
  const [h, m] = timeArg.split(':').map(Number);
  let newH = h + offsetHours;
  if (newH < 0) newH += 24;
  if (newH >= 24) newH -= 24;
  return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ── Agrupación por bloques ────────────────────────────────────────────────────
interface Block {
  name: string;
  items: ScheduleItem[];
}

function groupByBlocks(items: ScheduleItem[]): Block[] {
  const blocks: Block[] = [];
  let current: Block | null = null;
  for (const item of items) {
    const key = item.block_name || '';
    if (!current || current.name !== key) {
      current = { name: key, items: [item] };
      blocks.push(current);
    } else {
      current.items.push(item);
    }
  }
  return blocks;
}

// ── Componente principal ──────────────────────────────────────────────────────
const ProgramSection = () => {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { data: scheduleItems = [], isLoading } = useQuery({
    queryKey: ['schedule_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedule_items')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as ScheduleItem[];
    },
  });

  const dayItems = useMemo(
    () => scheduleItems.filter((i) => i.day === activeDay),
    [scheduleItems, activeDay]
  );
  const blocks = useMemo(() => groupByBlocks(dayItems), [dayItems]);

  return (
    <section id="programa" className="section-padding bg-muted/30" ref={ref}>
      <div className="container mx-auto max-w-5xl">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl md:text-5xl font-extrabold mb-4"
        >
          Programa
        </motion.h2>

        {/* Timezone reference */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 flex-wrap mb-10 text-xs text-muted-foreground"
        >
          <Globe className="w-4 h-4" />
          <span>Horarios de referencia:</span>
          {TIMEZONE_OFFSETS.map((tz) => (
            <span key={tz.label} className="glass-card rounded-full px-3 py-1">
              {tz.label}
            </span>
          ))}
        </motion.div>

        {/* Day tabs */}
        <div className="flex gap-3 mb-10 flex-wrap">
          <button
            onClick={() => setActiveDay(1)}
            className={`rounded-full px-6 py-3 font-bold text-sm transition-all ${
              activeDay === 1 ? 'bg-secondary text-secondary-foreground' : 'glass-card'
            }`}
          >
            Día 1 — "Conocer es Poder"
          </button>
          <button
            onClick={() => setActiveDay(2)}
            className={`rounded-full px-6 py-3 font-bold text-sm transition-all ${
              activeDay === 2 ? 'bg-secondary text-secondary-foreground' : 'glass-card'
            }`}
          >
            Día 2 — "Mi Vida, Mi Ritmo"
          </button>
        </div>

        <p className="font-handwritten text-xl text-accent mb-8">
          {activeDay === 1
            ? '"Conocer es Poder" — Teoría Médica · 26 de marzo 2026'
            : '"Mi Vida, Mi Ritmo" — Estilo de Vida y Futuro · 27 de marzo 2026'}
        </p>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && dayItems.length === 0 && (
          <p className="text-muted-foreground text-center py-16">
            El programa de este día estará disponible próximamente.
          </p>
        )}

        {/* Blocks */}
        {!isLoading && (
          <Accordion type="multiple" className="space-y-4">
            {blocks.map((block, bi) => {
              if (!block.name) {
                return block.items.map((item, ii) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1 + bi * 0.05 + ii * 0.03 }}
                  >
                    <TalkRow item={item} />
                  </motion.div>
                ));
              }

              return (
                <motion.div
                  key={block.name + bi}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + bi * 0.08 }}
                >
                  <AccordionItem
                    value={`block-${bi}`}
                    className="glass-card rounded-2xl border-none px-6"
                  >
                    <AccordionTrigger className="text-base md:text-lg font-bold hover:no-underline">
                      {block.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pb-2">
                        {block.items.map((item) => (
                          <TalkRow key={item.id} item={item} />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        )}
      </div>
    </section>
  );
};

// ── TalkRow ───────────────────────────────────────────────────────────────────
function TalkRow({ item }: { item: ScheduleItem }) {
  return (
    <div
      className={`rounded-xl p-4 flex flex-col md:flex-row gap-3 ${
        item.is_break ? 'bg-accent/10 border border-accent/20' : 'glass-card'
      }`}
    >
      {/* Time */}
      <div className="flex-shrink-0 md:w-48">
        <div className="flex items-center gap-2 text-sm font-semibold text-accent">
          {item.is_break ? <Coffee className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          {item.time_arg} hs
        </div>
        <div className="flex gap-2 mt-1 flex-wrap">
          {TIMEZONE_OFFSETS.slice(1).map((tz) => (
            <span key={tz.label} className="text-[10px] text-muted-foreground">
              {tz.label} {convertTime(item.time_arg, tz.offset)}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm md:text-base">
          {item.talk_title}
          {item.topic && (
            <span className="font-normal text-foreground/70"> — {item.topic}</span>
          )}
        </h4>
        {item.speaker && (
          <p className="text-xs text-muted-foreground mt-1">{item.speaker}</p>
        )}
      </div>
    </div>
  );
}

export default ProgramSection;
