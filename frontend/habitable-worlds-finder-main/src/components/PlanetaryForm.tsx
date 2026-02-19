import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export interface PlanetaryParams {
  planetRadius: number;
  planetMass: number;
  orbitalPeriod: number;
  equilibriumTemp: number;
  semiMajorAxis: number;
}

interface PlanetaryFormProps {
  params: PlanetaryParams;
  onChange: (params: PlanetaryParams) => void;
  errors: Partial<Record<keyof PlanetaryParams, string>>;
}

const fields = [
  {
    key: "planetRadius" as keyof PlanetaryParams,
    label: "Planet Radius",
    unit: "Earth Radii (R⊕)",
    min: 0.1,
    max: 10,
    step: 0.1,
    hint: "0.5 – 2.5 typical for rocky planets",
    icon: "🪐",
    formatValue: (v: number) => `${v.toFixed(1)} R⊕`,
  },
  {
    key: "planetMass" as keyof PlanetaryParams,
    label: "Planet Mass",
    unit: "Earth Masses (M⊕)",
    min: 0.1,
    max: 20,
    step: 0.1,
    hint: "0.3 – 10 typical range",
    icon: "🧱",
    formatValue: (v: number) => `${v.toFixed(1)} M⊕`,
  },
  {
    key: "orbitalPeriod" as keyof PlanetaryParams,
    label: "Orbital Period",
    unit: "Days",
    min: 1,
    max: 1000,
    step: 1,
    hint: "Earth = 365.25 days",
    icon: "🔄",
    formatValue: (v: number) => `${v} days`,
  },
  {
    key: "equilibriumTemp" as keyof PlanetaryParams,
    label: "Equilibrium Temperature",
    unit: "Kelvin (K)",
    min: 50,
    max: 800,
    step: 5,
    hint: "Habitable: 200 – 320 K",
    icon: "🌡️",
    formatValue: (v: number) => `${v} K`,
  },
  {
    key: "semiMajorAxis" as keyof PlanetaryParams,
    label: "Semi-Major Axis",
    unit: "AU",
    min: 0.01,
    max: 5,
    step: 0.01,
    hint: "Earth = 1.0 AU",
    icon: "📏",
    formatValue: (v: number) => `${v.toFixed(2)} AU`,
  },
];

const PlanetaryForm: React.FC<PlanetaryFormProps> = ({ params, onChange, errors }) => {
  const handleSlider = (key: keyof PlanetaryParams, value: number[]) => {
    onChange({ ...params, [key]: value[0] });
  };

  const handleInput = (key: keyof PlanetaryParams, raw: string) => {
    const num = parseFloat(raw);
    if (!isNaN(num)) onChange({ ...params, [key]: num });
  };

  return (
    <div className="space-y-5">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <span>{field.icon}</span>
              {field.label}
              <span className="text-muted-foreground text-xs ml-1">({field.unit})</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={params[field.key]}
                min={field.min}
                max={field.max}
                step={field.step}
                onChange={(e) => handleInput(field.key, e.target.value)}
                className="w-24 h-7 text-xs text-right bg-space-panel border-space-border text-primary font-orbitron"
              />
            </div>
          </div>
          <Slider
            min={field.min}
            max={field.max}
            step={field.step}
            value={[params[field.key]]}
            onValueChange={(v) => handleSlider(field.key, v)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="italic">{field.hint}</span>
            <span className="font-orbitron text-primary/70">{field.formatValue(params[field.key])}</span>
          </div>
          {errors[field.key] && (
            <p className="text-xs text-space-red mt-0.5">{errors[field.key]}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlanetaryForm;
