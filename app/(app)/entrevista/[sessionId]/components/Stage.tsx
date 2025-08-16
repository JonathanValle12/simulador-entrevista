import { MicOff, Video, VideoOff } from "lucide-react";

export default function Stage() {
    return (
        <div className="relative min-h-[400px] w-full rounded-xl bg-slate-800 mt-2">
            <div className="absolute right-3 top-3 flex gap-2">
                <button className="rounded-md p-1.5 shadow transition bg-white text-slate-700"><VideoOff className="h-4 w-4"/></button>
                <button className="rounded-md p-1.5 shadow transition bg-white text-slate-700"><MicOff className="h-4 w-4" /></button>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Video className="h-12 w-12 text-slate-400" aria-hidden />
                <p className="text-[13px] md:text-sm text-slate-400">Simulación de Videollamada</p>
            </div>
        </div>
    )
}