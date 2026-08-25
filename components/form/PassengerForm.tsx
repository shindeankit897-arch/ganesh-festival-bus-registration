"use client";

import { useState } from "react";
import type { z } from "zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { createPassengerSchema } from "@/lib/validation";
import { normalizeDigits } from "@/lib/numberLocale";
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
  ["mahad", "महाड", "MAHAD"],
  ["poladpur", "पोलादपूर", "POLADPUR"],
  ["mangaon", "माणगाव", "MANGAON"],
  ["dapoli", "दापोली", "DAPOLI"],
  ["mandangad", "मंडणगड", "MANDANGAD"],
  ["khed", "खेड", "KHED"],
  ["shrivardhan", "श्रीवर्धन", "SHRIVARDHAN"],
  ["guhaghar", "गुहाघर", "GUHAGHAR"],
  ["chiplun", "चिपळूण", "CHIPLUN"],
  ["pali", "पाली", "PALI"],
  ["sangmeshwar", "संगमेश्वर", "SANGMESHWAR"],
  ["lanja", "लांजा", "LANJA"],
  ["ratnagiri", "रत्नागिरी", "RATNAGIRI"],
  ["rajapur", "राजापूर", "RAJAPUR"],
  ["kharepatan", "खारेपाटण", "KHAREPATAN"],
  ["tarele", "तळेरे", "TARELE"],
  ["kankavli", "कणकवली", "KANKAVLI"],
  ["vaibhavwadi", "वैभववाडी", "VAIBHAVWADI"],
  ["kudal", "कुडाळ", "KUDAL"],
  ["sawantwadi", "सावंतवाडी", "SAWANTWADI"],
  ["devrukh", "देवरुख", "DEVRUKH"],
  ["sakharpa", "साखरपा", "SAKHARPA"],
  ["bhambed", "भांबेड", "BHAMBED"],
  ["malvan", "मालवण", "MALVAN"],
  ["devgad", "देवगड", "DEVGAD"],
] as const;

const relations = [
  ["wife", "पत्नी", "Wife"],
  ["husband", "पती", "Husband"],
  ["daughter", "मुलगी", "Daughter"],
  ["son", "मुलगा", "Son"],
  ["brother", "भाऊ", "Brother"],
  ["sister", "बहीण", "Sister"],
  ["mother", "आई", "Mother"],
  ["father", "वडील", "Father"],
  ["father_in_law", "सासरे", "Father in Law"],
  ["mother_in_law", "सासू", "Mother in Law"],
  ["son_in_law", "जावई", "Son in Law"],
  ["daughter_in_law", "सून", "Daughter in Law"],
] as const;

const defaultMember = {
  name: "",
  mobile: "",
  age: "1",
  gender: "male" as const,
  aadhaar: "",
  voterId: "",
  relation: "wife" as const,
};

export default function PassengerForm() {
  const { t, language } = useLanguage();
  const isMarathi = language === "mr";
  const schema = createPassengerSchema(t);
  const [loading, setLoading] = useState(false);

  // All visible form text changes with the selected language.
  // Stored database values remain canonical (e.g. "male", "wife", "mahad").
  const ui = isMarathi
    ? {
        personalDetails: "वैयक्तिक माहिती",
        addressDetails: "पत्ता व प्रवासाची माहिती",
        travelDetails: "प्रवासाची माहिती",
        familyMembers: "कुटुंबातील सदस्य",
        name: "पूर्ण नाव",
        mobile: "मोबाईल क्रमांक",
        age: "वय",
        gender: "लिंग",
        male: "पुरुष",
        female: "महिला",
        aadhaar: "आधार क्रमांक",
        voter: "मतदार ओळखपत्र क्रमांक",
        address: "पूर्ण पत्ता",
        addressPlaceholder: "पूर्ण पत्ता लिहा",
        destination: "गंतव्य",
        selectDestination: "गंतव्य निवडा",
        ward: "प्रभाग क्रमांक",
        selectWard: "प्रभाग निवडा",
        commonDetailsNote: "पत्ता, गंतव्य आणि प्रभाग क्रमांक सर्व कुटुंबातील सदस्यांसाठी समान राहतील.",
        familyNote: "खाली कुटुंबातील सदस्यांची माहिती भरा.",
        addFamilyMember: "कुटुंबातील सदस्य जोडा",
        removeFamilyMember: "काढून टाका",
        memberNumber: "कुटुंबातील सदस्य क्रमांक",
        noFamily: "अतिरिक्त कुटुंबातील सदस्य जोडलेला नाही.",
        relation: "नाते",
        selectRelation: "नाते निवडा",
        voterPlaceholder: "उपलब्ध नसल्यास रिक्त ठेवा",
        blankNote: "रिक्त ठेवल्यास NA म्हणून जतन केले जाईल.",
        submit: "नोंदणी करा",
        clear: "साफ करा",
        pleaseWait: "कृपया प्रतीक्षा करा...",
        successOne: "प्रवासी यशस्वीरित्या नोंदणीकृत झाला.",
        successMany: "प्रवासी यशस्वीरित्या नोंदणीकृत झाले.",
        saveError: "प्रवाशाची माहिती जतन करता आली नाही.",
      }
    : {
        personalDetails: t.personalDetails,
        addressDetails: t.addressDetails,
        travelDetails: t.travelDetails,
        familyMembers: t.familyMembers,
        name: t.name,
        mobile: t.mobile,
        age: t.age,
        gender: t.gender,
        male: t.male,
        female: t.female,
        aadhaar: t.aadhaar,
        voter: t.voter,
        address: t.address,
        addressPlaceholder: t.addressPlaceholder,
        destination: t.destination,
        selectDestination: t.selectDestination,
        ward: t.ward,
        selectWard: t.selectWard,
        commonDetailsNote: t.commonDetailsNote,
        familyNote: t.commonDetailsNote,
        addFamilyMember: t.addFamilyMember,
        removeFamilyMember: t.removeFamilyMember,
        memberNumber: t.memberNumber,
        noFamily: "No additional family member added.",
        relation: t.relation,
        selectRelation: t.selectRelation,
        voterPlaceholder: "Leave blank if not available",
        blankNote: "Blank will be saved as NA.",
        submit: t.submit,
        clear: t.clear,
        pleaseWait: "Please wait...",
        successOne: "passenger registered successfully",
        successMany: "passengers registered successfully",
        saveError: "Failed to save passenger details.",
      };

  const { register, control, handleSubmit, reset, formState: { errors } } =
    useForm<z.input<ReturnType<typeof createPassengerSchema>>, any, PassengerSchema>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: "",
        mobile: "",
        age: "1",
        gender: "male",
        aadhaar: "",
        voterId: "",
        address: "",
        destination: "",
        ward: "",
        familyMembers: [],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "familyMembers",
  });

  const onSubmit = async (data: PassengerSchema) => {
    setLoading(true);

    try {
      const registrationRows = [
        {
          name: data.name.trim(),
          mobile: data.mobile,
          age: data.age,
          gender: data.gender,
          aadhaar: data.aadhaar,
          voter_id: data.voterId?.trim() || "NA",
          relation: "self",
          language,
          address: data.address,
          destination: data.destination,
          ward: data.ward,
        },
        ...(data.familyMembers ?? []).map((member) => ({
          name: member.name.trim(),
          mobile: member.mobile || "NA",
          age: member.age,
          gender: member.gender,
          aadhaar: member.aadhaar || "NA",
          voter_id: member.voterId?.trim() || "NA",
          relation: member.relation,
          language,
          address: data.address,
          destination: data.destination,
          ward: data.ward,
        })),
      ];

      const result = await supabase.from("passengers").insert(registrationRows);
      if (result.error) throw result.error;

      toast.success(
        isMarathi
          ? registrationRows.length === 1
            ? ui.successOne
            : ui.successMany
          : `${registrationRows.length} ${registrationRows.length === 1 ? ui.successOne : ui.successMany}`
      );

      reset();
    } catch (error) {
      console.error(error);
      toast.error(ui.saveError);
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (message?: string) =>
    message ? <p className="mt-1 text-sm text-red-500">{message}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 1. PERSONAL DETAILS */}
      <Card className="p-4 shadow-lg sm:p-6">
        <h2 className="mb-6 text-2xl font-bold text-orange-600">
          👤 {ui.personalDetails}
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">{ui.name} *</label>
            <Input {...register("name")} placeholder={ui.name} />
            {fieldError(errors.name?.message)}
          </div>

          <div>
            <label className="mb-2 block font-medium">{ui.mobile} *</label>
            <Input
              {...register("mobile", {
                setValueAs: (v) => normalizeDigits(String(v ?? "")),
              })}
              inputMode="numeric"
              maxLength={10}
              placeholder={ui.mobile}
            />
            {fieldError(errors.mobile?.message)}
          </div>

          <div>
            <label className="mb-2 block font-medium">{ui.age} *</label>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={3}
              {...register("age", {
                setValueAs: (v) => normalizeDigits(String(v ?? "")),
              })}
              placeholder={ui.age}
            />
            {fieldError(errors.age?.message)}
          </div>

          <div>
            <label className="mb-2 block font-medium">{ui.gender} *</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={ui.gender} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{ui.male}</SelectItem>
                    <SelectItem value="female">{ui.female}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {fieldError(errors.gender?.message)}
          </div>

          <div>
            <label className="mb-2 block font-medium">{ui.aadhaar} *</label>
            <Input
              {...register("aadhaar", {
                setValueAs: (v) => normalizeDigits(String(v ?? "")),
              })}
              inputMode="numeric"
              maxLength={12}
              placeholder={ui.aadhaar}
            />
            {fieldError(errors.aadhaar?.message)}
          </div>

          <div>
            <label className="mb-2 block font-medium">{ui.voter}</label>
            <Input
              {...register("voterId")}
              placeholder={ui.voterPlaceholder}
            />
            <p className="mt-1 text-xs text-gray-500">{ui.blankNote}</p>
          </div>
        </div>
      </Card>

      {/* 2. ADDRESS + DESTINATION + WARD */}
      <Card className="p-4 shadow-lg sm:p-6">
        <h2 className="mb-6 text-2xl font-bold text-orange-600">
          📍 {ui.addressDetails}
        </h2>

        <div>
          <label className="mb-2 block font-medium">{ui.address} *</label>
          <Textarea
            {...register("address")}
            placeholder={ui.addressPlaceholder}
            className="min-h-32"
          />
          {fieldError(errors.address?.message)}
        </div>

        <h2 className="mb-6 mt-8 text-2xl font-bold text-orange-600">
          🚌 {ui.travelDetails}
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">{ui.destination} *</label>
            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={ui.selectDestination} />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map(([value, mr, en]) => (
                      <SelectItem key={value} value={value}>
                        {isMarathi ? mr : en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {fieldError(errors.destination?.message)}
          </div>

          <div>
            <label className="mb-2 block font-medium">{ui.ward} *</label>
            <Controller
              name="ward"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={ui.selectWard} />
                  </SelectTrigger>
                  <SelectContent>
                    {["123", "124", "126", "127", "128", "129"].map((ward) => (
                      <SelectItem key={ward} value={ward}>
                        {ward}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {fieldError(errors.ward?.message)}
          </div>
        </div>

        <p className="mt-4 rounded-lg bg-orange-50 p-3 text-sm text-gray-600">
          {ui.commonDetailsNote}
        </p>
      </Card>

      {/* 3. FAMILY DETAILS */}
      <Card className="p-4 shadow-lg sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-orange-600">
              👨‍👩‍👧 {ui.familyMembers}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{ui.familyNote}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => append(defaultMember)}
            className="w-full sm:w-auto"
          >
            <Plus size={18} /> {ui.addFamilyMember}
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="mt-5 rounded-lg border border-dashed border-orange-300 bg-orange-50 p-4 text-center text-sm text-gray-600">
            {ui.noFamily}
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {fields.map((field, index) => {
              const memberError = errors.familyMembers?.[index];

              return (
                <div
                  key={field.id}
                  className="rounded-xl border border-orange-200 bg-orange-50/40 p-4 sm:p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-bold text-orange-700">
                      {ui.memberNumber} {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} /> {ui.removeFamilyMember}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block font-medium">
                        {ui.name} *
                      </label>
                      <Input {...register(`familyMembers.${index}.name`)} />
                      {fieldError(memberError?.name?.message)}
                    </div>

                    <div>
                      <label className="mb-2 block font-medium">
                        {ui.mobile}
                      </label>
                      <Input
                        {...register(`familyMembers.${index}.mobile`, {
                          setValueAs: (v) =>
                            normalizeDigits(String(v ?? "")),
                        })}
                        inputMode="numeric"
                        maxLength={10}
                      />
                      {fieldError(memberError?.mobile?.message)}
                    </div>

                    <div>
                      <label className="mb-2 block font-medium">
                        {ui.age} *
                      </label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        {...register(`familyMembers.${index}.age`, {
                          setValueAs: (v) =>
                            normalizeDigits(String(v ?? "")),
                        })}
                      />
                      {fieldError(memberError?.age?.message)}
                    </div>

                    <div>
                      <label className="mb-2 block font-medium">
                        {ui.gender} *
                      </label>
                      <Controller
                        name={`familyMembers.${index}.gender`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={ui.gender} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">{ui.male}</SelectItem>
                              <SelectItem value="female">{ui.female}</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {fieldError(memberError?.gender?.message)}
                    </div>

                    <div>
                      <label className="mb-2 block font-medium">
                        {ui.aadhaar}
                      </label>
                      <Input
                        {...register(`familyMembers.${index}.aadhaar`, {
                          setValueAs: (v) =>
                            normalizeDigits(String(v ?? "")),
                        })}
                        inputMode="numeric"
                        maxLength={12}
                      />
                      {fieldError(memberError?.aadhaar?.message)}
                    </div>

                    <div>
                      <label className="mb-2 block font-medium">
                        {ui.voter}
                      </label>
                      <Input {...register(`familyMembers.${index}.voterId`)} />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block font-medium">
                        {ui.relation} *
                      </label>
                      <Controller
                        name={`familyMembers.${index}.relation`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={ui.selectRelation} />
                            </SelectTrigger>
                            <SelectContent>
                              {relations.map(([value, mr, en]) => (
                                <SelectItem key={value} value={value}>
                                  {isMarathi ? mr : en}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {fieldError(memberError?.relation?.message)}
                    </div>
                  </div>

                  {/* Add button is also at the bottom of every family card,
                      so the user does not need to scroll back to the top. */}
                  <div className="mt-5 flex justify-end border-t border-orange-200 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => append(defaultMember)}
                      className="w-full sm:w-auto"
                    >
                      <Plus size={18} /> {ui.addFamilyMember}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* FORM ACTIONS */}
      <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center">
        <Button
          type="submit"
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {loading ? ui.pleaseWait : ui.submit}
        </Button>

        <Button type="button" variant="outline" onClick={() => reset()}>
          {ui.clear}
        </Button>
      </div>
    </form>
  );
}
