import { Header } from '@/components/layout/Header';
import { GlobalEffects } from '@/components/layout/GlobalEffects';
import { ControlPanel } from '@/components/layout/ControlPanel';
import { LeafletMap } from '@/components/map/LeafletMap';
import { AnalysisPanel } from '@/components/layout/AnalysisPanel';
import { Providers } from '@/components/Providers';

export default function Home() {
  return (
    <Providers>
      <main className="relative min-h-screen pt-[60px] flex flex-col lg:flex-row overflow-hidden bg-bg">
        <GlobalEffects />
        <Header />
        <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-60px)] overflow-hidden">
          <ControlPanel />
          <AnalysisPanel />
        </div>
      </main>
    </Providers>
  );
}
