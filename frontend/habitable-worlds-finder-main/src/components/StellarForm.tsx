import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type StarType = "G" | "K" | "M" | "F";

export interface StellarParams {
  starTemp: number;
  starLuminosity: number;
  starType: StarType;
  starMass: number;
}

interface StellarFormProps {
  params: StellarParams;
  onChange: (params: StellarParams) => void;
  errors: Partial<Record<keyof StellarParams, string>>;
}

const starTypeOptions: { value: StarType; label: string; description: string }[] = [
  { value: "G", label: "G-Type (Sun-like)", description: "~5778 K, yellow-white" },
  { value: "K", label: "K-Type (Orange Dwarf)", description: "~4000–5250 K, orange" },
  { value: "M", label: "M-Type (Red Dwarf)", description: "~2500–3900 K, red" },
  { value: "F", label: "F-Type (Yellow-White)", description: "~6000–7500 K" },
];

const starTypeDefaults: Record<StarType, Partial<StellarParams>> = {
  G: { starTemp: 5778, starLuminosity: 1.0, starMass: 1.0 },
  K: { starTemp: 4500, starLuminosity: 0.4, starMass: 0.75 },
  M: { starTemp: 3200, starLuminosity: 0.08, starMass: 0.4 },
  F: { starTemp: 6700, starLuminosity: 2.5, starMass: 1.3 },
};

const StellarForm: React.FC<StellarFormProps> = ({ params, onChange, errors }) => {
  const handleStarType = (value: StarType) => {
    const defaults = starTypeDefaults[value];
    onChange({ ...params, ...defaults, starType: value });
  };

  return (
    <div className="space-y-5">
      {/* Star Type */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-sm font-medium">
          <span>⭐</span> Star Classification
        </Label>
        <Select value={params.starType} onValueChange={(v) => handleStarType(v as StarType)}>
          <SelectTrigger className="bg-space-panel border-space-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-space-card border-space-border">
            {starTypeOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-foreground hover:bg-space-panel focus:bg-space-panel"
              >
                <div>
                  <div>{opt.label}</div>
                  <div className="text-xs text-muted-foreground">{opt.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground italic">
          Selecting a type auto-fills default values
        </p>
      </div>

      {/* Star Temperature */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <span>🔥</span> Star Temperature
            <span className="text-muted-foreground text-xs ml-1">(Kelvin)</span>
          </Label>
          <Input
            type="number"
            value={params.starTemp}
            min={2000}
            max={12000}
            step={100}
            onChange={(e) => onChange({ ...params, starTemp: parseFloat(e.target.value) || params.starTemp })}
            className="w-24 h-7 text-xs text-right bg-space-panel border-space-border text-primary font-orbitron"
          />
        </div>
        <Slider
          min={2000}
          max={12000}
          step={100}
          value={[params.starTemp]}
          onValueChange={(v) => onChange({ ...params, starTemp: v[0] })}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="italic">Sun = 5778 K</span>
          <span className="font-orbitron text-primary/70">{params.starTemp.toLocaleString()} K</span>
        </div>
        {errors.starTemp && <p className="text-xs text-space-red">{errors.starTemp}</p>}
      </div>

      {/* Star Luminosity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <span>💡</span> Star Luminosity
            <span className="text-muted-foreground text-xs ml-1">(Solar units L☉)</span>
          </Label>
          <Input
            type="number"
            value={params.starLuminosity}
            min={0.001}
            max={100}
            step={0.01}
            onChange={(e) => onChange({ ...params, starLuminosity: parseFloat(e.target.value) || params.starLuminosity })}
            className="w-24 h-7 text-xs text-right bg-space-panel border-space-border text-primary font-orbitron"
          />
        </div>
        <Slider
          min={0.001}
          max={10}
          step={0.001}
          value={[Math.min(params.starLuminosity, 10)]}
          onValueChange={(v) => onChange({ ...params, starLuminosity: v[0] })}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="italic">Sun = 1.0 L☉</span>
          <span className="font-orbitron text-primary/70">{params.starLuminosity.toFixed(3)} L☉</span>
        </div>
        {errors.starLuminosity && <p className="text-xs text-space-red">{errors.starLuminosity}</p>}
      </div>

      {/* Star Mass */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <span>⚖️</span> Star Mass
            <span className="text-muted-foreground text-xs ml-1">(Solar masses M☉)</span>
          </Label>
          <Input
            type="number"
            value={params.starMass}
            min={0.08}
            max={8}
            step={0.01}
            onChange={(e) => onChange({ ...params, starMass: parseFloat(e.target.value) || params.starMass })}
            className="w-24 h-7 text-xs text-right bg-space-panel border-space-border text-primary font-orbitron"
          />
        </div>
        <Slider
          min={0.08}
          max={4}
          step={0.01}
          value={[Math.min(params.starMass, 4)]}
          onValueChange={(v) => onChange({ ...params, starMass: v[0] })}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="italic">Sun = 1.0 M☉</span>
          <span className="font-orbitron text-primary/70">{params.starMass.toFixed(2)} M☉</span>
        </div>
        {errors.starMass && <p className="text-xs text-space-red">{errors.starMass}</p>}
      </div>
    </div>
  );
};

export default StellarForm;
