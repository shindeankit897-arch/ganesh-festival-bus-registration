"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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

export default function PassengerForm() {
  const { t, language } = useLanguage();

  const schema = createPassengerSchema(t);

  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PassengerSchema>({
    resolver: zodResolver(schema),

    defaultValues: {
      name: "",
      mobile: "",
      dob: "",
      aadhaar: "",
      voterId: "",
      address: "",
      destination: "",
      ward: "",
    },
  });

  const onSubmit = async (data: PassengerSchema) => {
    setLoading(true);

    try {
      const payload = {
        ...data,
        voterId: data.voterId?.trim() || "NA",
      };

const result = await supabase
  .from("passengers")
  .insert([
    {
      name: payload.name,
      mobile: payload.mobile,
      dob: payload.dob,
      aadhaar: payload.aadhaar,
      voter_id: payload.voterId,
      address: payload.address,
      destination: payload.destination,
      ward: payload.ward,
    },
  ]);

console.log("Supabase Result:", result);

if (result.error) {
  alert(
    JSON.stringify(
      {
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint,
        code: result.error.code,
      },
      null,
      2
    )
  );

  throw result.error;
}

      toast.success("Passenger Registered Successfully");

      reset();
    } catch (error) {
      console.error(error);

      toast.error("Failed to save passenger details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >

      <Card className="p-6 shadow-lg">

        <h2 className="mb-6 text-2xl font-bold text-orange-600">
          👤 {t.personalDetails}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">          {/* Full Name */}
          <div>
            <label className="mb-2 block font-medium">
              {t.name} <span className="text-red-500">*</span>
            </label>

            <Input
              {...register("name")}
              placeholder={t.name}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="mb-2 block font-medium">
              {t.mobile} <span className="text-red-500">*</span>
            </label>

            <Input
              {...register("mobile")}
              placeholder={t.mobile}
              maxLength={10}
            />

            {errors.mobile && (
              <p className="mt-1 text-sm text-red-500">
                {errors.mobile.message}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="mb-2 block font-medium">
              {t.dob} <span className="text-red-500">*</span>
            </label>

            <Input
              type="date"
              {...register("dob")}
            />

            {errors.dob && (
              <p className="mt-1 text-sm text-red-500">
                {errors.dob.message}
              </p>
            )}
          </div>

          {/* Aadhaar */}
          <div>
            <label className="mb-2 block font-medium">
              {t.aadhaar} <span className="text-red-500">*</span>
            </label>

            <Input
              {...register("aadhaar")}
              placeholder={t.aadhaar}
              maxLength={12}
            />

            {errors.aadhaar && (
              <p className="mt-1 text-sm text-red-500">
                {errors.aadhaar.message}
              </p>
            )}
          </div>

          {/* Voter ID */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-medium">
              {t.voter}
            </label>

            <Input
              {...register("voterId")}
              placeholder="Leave blank if not available"
            />

            <p className="mt-2 text-sm text-gray-500">
              Leave blank if not available. It will automatically be saved as <strong>NA</strong>.
            </p>
          </div>

        </div>

      </Card>

      <Card className="p-6 shadow-lg">

        <h2 className="mb-6 text-2xl font-bold text-orange-600">
          📍 {t.addressDetails}
        </h2>

        <label className="mb-2 block font-medium">
          {t.address} <span className="text-red-500">*</span>
        </label>

        <Textarea
          {...register("address")}
          placeholder={t.addressPlaceholder}
          className="min-h-32"
        />

        {errors.address && (
          <p className="mt-1 text-sm text-red-500">
            {errors.address.message}
          </p>
        )}

      </Card>

      <Card className="p-6 shadow-lg">

        <h2 className="mb-6 text-2xl font-bold text-orange-600">
          🚌 {t.travelDetails}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
	          {/* Destination */}
          <div>
            <label className="mb-2 block font-medium">
              {t.destination} <span className="text-red-500">*</span>
            </label>

            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectDestination} />
                  </SelectTrigger>

                  <SelectContent>
  <SelectItem value="poladpur">
    {language === "mr" ? "पोलादपूर" : "POLADPUR"}
  </SelectItem>

  <SelectItem value="dapoli">
    {language === "mr" ? "दापोली" : "DAPOLI"}
  </SelectItem>

  <SelectItem value="devgad">
    {language === "mr" ? "देवगड" : "DEVGAD"}
  </SelectItem>

  <SelectItem value="chiplun">
    {language === "mr" ? "चिपळूण" : "CHIPLUN"}
  </SelectItem>

  <SelectItem value="khed">
    {language === "mr" ? "खेड" : "KHED"}
  </SelectItem>

  <SelectItem value="shrivardhan">
    {language === "mr" ? "श्रीवर्धन" : "SHRIVARDHAN"}
  </SelectItem>

  <SelectItem value="mangaon">
    {language === "mr" ? "माणगाव" : "MANGAON"}
  </SelectItem>

  <SelectItem value="guhaghar">
    {language === "mr" ? "गुहाघर" : "GUHAGHAR"}
  </SelectItem>

  <SelectItem value="sangmeshwar">
    {language === "mr" ? "संगमेश्वर" : "SANGMESHWAR"}
  </SelectItem>

  <SelectItem value="lanja">
    {language === "mr" ? "लांजा" : "LANJA"}
  </SelectItem>

  <SelectItem value="ratnagiri">
    {language === "mr" ? "रत्नागिरी" : "RATNAGIRI"}
  </SelectItem>

  <SelectItem value="mahad">
    {language === "mr" ? "महाड" : "MAHAD"}
  </SelectItem>

  <SelectItem value="kharepatan">
    {language === "mr" ? "खारेपाटण" : "KHAREPATAN"}
  </SelectItem>

  <SelectItem value="kankavli">
    {language === "mr" ? "कणकवली" : "KANKAVLI"}
  </SelectItem>

  <SelectItem value="taral">
    {language === "mr" ? "ताराल" : "TARAL"}
  </SelectItem>

  <SelectItem value="rajapur">
    {language === "mr" ? "राजापूर" : "RAJAPUR"}
  </SelectItem>

  <SelectItem value="sawantwadi">
    {language === "mr" ? "सावंतवाडी" : "SAWANTWADI"}
  </SelectItem>

  <SelectItem value="sarkhpa">
    {language === "mr" ? "सरखपा" : "SARKHPA"}
  </SelectItem>

  <SelectItem value="devrukh">
    {language === "mr" ? "देवरुख" : "DEVRUKH"}
  </SelectItem>

  <SelectItem value="bhanbed">
    {language === "mr" ? "भानबेड" : "BHANBED"}
  </SelectItem>

  <SelectItem value="malvan">
    {language === "mr" ? "मालवण" : "MALVAN"}
  </SelectItem>

  <SelectItem value="mandangad">
    {language === "mr" ? "मंडणगड" : "MANDANGAD"}
  </SelectItem>
</SelectContent>
                </Select>
              )}
            />

            {errors.destination && (
              <p className="mt-1 text-sm text-red-500">
                {errors.destination.message}
              </p>
            )}
          </div>

          {/* Ward */}
          <div>
            <label className="mb-2 block font-medium">
              {t.ward} <span className="text-red-500">*</span>
            </label>

            <Controller
              name="ward"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectWard} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="123">123</SelectItem>
                    <SelectItem value="124">124</SelectItem>
                    <SelectItem value="126">126</SelectItem>
                    <SelectItem value="127">127</SelectItem>
                    <SelectItem value="128">128</SelectItem>
                    <SelectItem value="129">129</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.ward && (
              <p className="mt-1 text-sm text-red-500">
                {errors.ward.message}
              </p>
            )}
          </div>

        </div>

      </Card>

      <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center">

        <Button
          type="submit"
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {loading ? "Please wait..." : t.submit}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
        >
          {t.clear}
        </Button>

      </div>

    </form>
  );
}