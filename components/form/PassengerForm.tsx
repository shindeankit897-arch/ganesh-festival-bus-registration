"use client";

import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { createPassengerSchema } from "@/lib/validation";
import type { PassengerSchema } from "@/lib/validation";
import { useLanguage } from "@/context/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const destinations = [
  ["poladpur", "पोलादपूर", "POLADPUR"], ["dapoli", "दापोली", "DAPOLI"],
  ["devgad", "देवगड", "DEVGAD"], ["chiplun", "चिपळूण", "CHIPLUN"],
  ["khed", "खेड", "KHED"], ["shrivardhan", "श्रीवर्धन", "SHRIVARDHAN"],
  ["mangaon", "माणगाव", "MANGAON"], ["guhaghar", "गुहाघर", "GUHAGHAR"],
  ["sangmeshwar", "संगमेश्वर", "SANGMESHWAR"], ["lanja", "लांजा", "LANJA"],
  ["ratnagiri", "रत्नागिरी", "RATNAGIRI"], ["mahad", "महाड", "MAHAD"],
  ["kharepatan", "खारेपाटण", "KHAREPATAN"], ["kankavli", "कणकवली", "KANKAVLI"],
  ["taral", "ताराल", "TARAL"], ["rajapur", "राजापूर", "RAJAPUR"],
  ["sawantwadi", "सावंतवाडी", "SAWANTWADI"], ["sarkhpa", "सरखपा", "SARKHPA"],
  ["devrukh", "देवरुख", "DEVRUKH"], ["bhanbed", "भानबेड", "BHANBED"],
  ["malvan", "मालवण", "MALVAN"], ["mandangad", "मंडणगड", "MANDANGAD"],
] as const;

const relations = [
  ["wife", "पत्नी", "Wife"], ["daughter", "मुलगी", "Daughter"],
  ["son", "मुलगा", "Son"], ["mother", "आई", "Mother"],
  ["father", "वडील", "Father"], ["son_in_law", "जावई", "Son in Law"],
  ["daughter_in_law", "सून", "Daughter in Law"],
] as const;

const defaultMember = {
  name: "", mobile: "", age: 1, gender: "male" as const,
  aadhaar: "", voterId: "", relation: "wife" as const,
};

export default function PassengerForm() {
  const { t, language } = useLanguage();
  const schema = createPassengerSchema(t);
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, reset, formState: { errors } } =
    useForm<PassengerSchema>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: "", mobile: "", age: 1, gender: "male", aadhaar: "", voterId: "",
        address: "", destination: "", ward: "", familyMembers: [],
      },
    });

  const { fields, append, remove } = useFieldArray({ control, name: "familyMembers" });

  const onSubmit = async (data: PassengerSchema) => {
    setLoading(true);
    try {
      const registrationRows = [
        {
          name: data.name.trim(), mobile: data.mobile, age: data.age, gender: data.gender,
          aadhaar: data.aadhaar, voter_id: data.voterId?.trim() || "NA", relation: "self",
          address: data.address, destination: data.destination, ward: data.ward,
        },
        ...(data.familyMembers ?? []).map((member) => ({
          name: member.name.trim(), mobile: member.mobile || "NA", age: member.age,
          gender: member.gender, aadhaar: member.aadhaar || "NA",
          voter_id: member.voterId?.trim() || "NA", relation: member.relation,
          address: data.address, destination: data.destination, ward: data.ward,
        })),
      ];

      const result = await supabase.from("passengers").insert(registrationRows);
      if (result.error) throw result.error;

      toast.success(
        `${registrationRows.length} ${registrationRows.length === 1 ? "passenger" : "passengers"} registered successfully`
      );
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save passenger details.");
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (message?: string) => message ? <p className="mt-1 text-sm text-red-500">{message}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card className="p-4 shadow-lg sm:p-6">
        <h2 className="mb-6 text-2xl font-bold text-orange-600">👤 {t.personalDetails}</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div><label className="mb-2 block font-medium">{t.name} *</label><Input {...register("name")} placeholder={t.name} />{fieldError(errors.name?.message)}</div>
          <div><label className="mb-2 block font-medium">{t.mobile} *</label><Input {...register("mobile")} inputMode="numeric" maxLength={10} placeholder={t.mobile} />{fieldError(errors.mobile?.message)}</div>
          <div><label className="mb-2 block font-medium">{t.age} *</label><Input type="number" min={1} max={120} {...register("age", { valueAsNumber: true })} placeholder={t.age} />{fieldError(errors.age?.message)}</div>
          <div>
            <label className="mb-2 block font-medium">{t.gender} *</label>
            <Controller name="gender" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue placeholder={t.gender} /></SelectTrigger><SelectContent><SelectItem value="male">{t.male}</SelectItem><SelectItem value="female">{t.female}</SelectItem></SelectContent></Select>
            )} />{fieldError(errors.gender?.message)}
          </div>
          <div><label className="mb-2 block font-medium">{t.aadhaar} *</label><Input {...register("aadhaar")} inputMode="numeric" maxLength={12} placeholder={t.aadhaar} />{fieldError(errors.aadhaar?.message)}</div>
          <div><label className="mb-2 block font-medium">{t.voter}</label><Input {...register("voterId")} placeholder="Leave blank if not available" /><p className="mt-1 text-xs text-gray-500">Blank will be saved as NA.</p></div>
        </div>
      </Card>

      <Card className="p-4 shadow-lg sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-2xl font-bold text-orange-600">👨‍👩‍👧 {t.familyMembers}</h2><p className="mt-1 text-sm text-gray-500">{t.commonDetailsNote}</p></div>
          <Button type="button" variant="outline" onClick={() => append(defaultMember)} className="w-full sm:w-auto"><Plus size={18} /> {t.addFamilyMember}</Button>
        </div>

        {fields.length === 0 ? <div className="mt-5 rounded-lg border border-dashed border-orange-300 bg-orange-50 p-4 text-center text-sm text-gray-600">No additional family member added.</div> : (
          <div className="mt-6 space-y-5">
            {fields.map((field, index) => {
              const memberError = errors.familyMembers?.[index];
              return <div key={field.id} className="rounded-xl border border-orange-200 bg-orange-50/40 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3"><h3 className="font-bold text-orange-700">{t.memberNumber} {index + 1}</h3><button type="button" onClick={() => remove(index)} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"><Trash2 size={16} /> {t.removeFamilyMember}</button></div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div><label className="mb-2 block font-medium">{t.name} *</label><Input {...register(`familyMembers.${index}.name`)} />{fieldError(memberError?.name?.message)}</div>
                  <div><label className="mb-2 block font-medium">{t.mobile}</label><Input {...register(`familyMembers.${index}.mobile`)} inputMode="numeric" maxLength={10} />{fieldError(memberError?.mobile?.message)}</div>
                  <div><label className="mb-2 block font-medium">{t.age} *</label><Input type="number" min={1} max={120} {...register(`familyMembers.${index}.age`, { valueAsNumber: true })} />{fieldError(memberError?.age?.message)}</div>
                  <div><label className="mb-2 block font-medium">{t.gender} *</label><Controller name={`familyMembers.${index}.gender`} control={control} render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue placeholder={t.gender} /></SelectTrigger><SelectContent><SelectItem value="male">{t.male}</SelectItem><SelectItem value="female">{t.female}</SelectItem></SelectContent></Select>} />{fieldError(memberError?.gender?.message)}</div>
                  <div><label className="mb-2 block font-medium">{t.aadhaar}</label><Input {...register(`familyMembers.${index}.aadhaar`)} inputMode="numeric" maxLength={12} />{fieldError(memberError?.aadhaar?.message)}</div>
                  <div><label className="mb-2 block font-medium">{t.voter}</label><Input {...register(`familyMembers.${index}.voterId`)} /></div>
                  <div className="md:col-span-2"><label className="mb-2 block font-medium">{t.relation} *</label><Controller name={`familyMembers.${index}.relation`} control={control} render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue placeholder={t.selectRelation} /></SelectTrigger><SelectContent>{relations.map(([value, mr, en]) => <SelectItem key={value} value={value}>{language === "mr" ? mr : en}</SelectItem>)}</SelectContent></Select>} />{fieldError(memberError?.relation?.message)}</div>
                </div>
              </div>;
            })}
          </div>
        )}
      </Card>

      <Card className="p-4 shadow-lg sm:p-6">
        <h2 className="mb-6 text-2xl font-bold text-orange-600">📍 {t.addressDetails}</h2>
        <label className="mb-2 block font-medium">{t.address} *</label>
        <Textarea {...register("address")} placeholder={t.addressPlaceholder} className="min-h-32" />
        {fieldError(errors.address?.message)}
      </Card>

      <Card className="p-4 shadow-lg sm:p-6">
        <h2 className="mb-6 text-2xl font-bold text-orange-600">🚌 {t.travelDetails}</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div><label className="mb-2 block font-medium">{t.destination} *</label><Controller name="destination" control={control} render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue placeholder={t.selectDestination} /></SelectTrigger><SelectContent>{destinations.map(([value, mr, en]) => <SelectItem key={value} value={value}>{language === "mr" ? mr : en}</SelectItem>)}</SelectContent></Select>} />{fieldError(errors.destination?.message)}</div>
          <div><label className="mb-2 block font-medium">{t.ward} *</label><Controller name="ward" control={control} render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue placeholder={t.selectWard} /></SelectTrigger><SelectContent>{["123","124","126","127","128","129"].map((ward) => <SelectItem key={ward} value={ward}>{ward}</SelectItem>)}</SelectContent></Select>} />{fieldError(errors.ward?.message)}</div>
        </div>
        <p className="mt-4 rounded-lg bg-orange-50 p-3 text-sm text-gray-600">{t.commonDetailsNote}</p>
      </Card>

      <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center">
        <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">{loading ? "Please wait..." : t.submit}</Button>
        <Button type="button" variant="outline" onClick={() => reset()}>{t.clear}</Button>
      </div>
    </form>
  );
}
