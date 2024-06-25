"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from "../ui/dialog";
import AddClassificationForm from "./AddClassificationForm";

const types = [
  { label: "Income", value: "in" },
  { label: "Expense", value: "ex" },
] as const;

const fromSchema = z.object({
  description: z.string().min(1),
  type: z.string({
    required_error: "Please select a type.",
  }),
  classification: z
    .union([z.string(), z.undefined()])
    .refine((val) => val !== undefined && val !== "", {
      message: "Please select a classification.",
    }),
  amount: z.coerce.number().positive(),
});

const RecordTransactionForm = () => {
  const [typeopen, setTypeopen] = useState(false);
  const [type, setType] = useState("");
  const [classificationopen, setCassificationopen] = useState(false);
  const [dialogopen, setDialogopen] = useState(false);
  const [classifications, setCassifications] = useState<any[]>([]);

  useEffect(() => {
    const getClassifications = async () => {
      const session = await fetch("/api/session");
      const sessionData = await session.json();
      const params = new URLSearchParams({
        userId: sessionData?.user.id,
        transactionType: type,
      });
      const response = await fetch(
        `/api/transactionClassifications?${params.toString()}`,
        {
          method: "GET",
        }
      );
      const classificationData = await response.json();
      if (classificationData) {
        const transformedData = classificationData.map((item: any) => ({
          label: item.transaction_subtype,
          value: item.transaction_subtype,
        }));
        setCassifications(transformedData);
      }
    };
    getClassifications();
  }, [type, dialogopen]);

  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      description: "",
    },
  });

  const submitData = () => {};

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Record Transactions</h2>
      <Dialog open={dialogopen} onOpenChange={setDialogopen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Classification</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <AddClassificationForm
            typeValue={form.getValues("type")}
            setDialogopen={setDialogopen}
          />
        </DialogContent>
      </Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitData)}>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Type</FormLabel>
                <Popover open={typeopen} onOpenChange={setTypeopen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(!field.value && "text-muted-foreground")}
                      >
                        {field.value
                          ? types.find((type) => type.value === field.value)
                              ?.label
                          : "Select Type"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search Type..." />
                      <CommandList>
                        <CommandEmpty>No type found.</CommandEmpty>
                        <CommandGroup>
                          {types.map((type) => (
                            <CommandItem
                              value={type.label}
                              key={type.value}
                              onSelect={() => {
                                form.setValue("type", type.value);
                                setTypeopen(false);
                                setType(type.label);
                                form.setValue("classification", undefined);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  type.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {type.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="classification"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Classification</FormLabel>
                <Popover
                  open={classificationopen}
                  onOpenChange={setCassificationopen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(!field.value && "text-muted-foreground")}
                        disabled={form.getValues("type") ? false : true}
                      >
                        {field.value
                          ? classifications.find(
                              (classification) =>
                                classification.value === field.value
                            )?.label
                          : "Select Classification"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search Classification..." />
                      <CommandList>
                        <CommandEmpty>No Classification found.</CommandEmpty>
                        <CommandGroup>
                          {classifications.map((classification) => (
                            <CommandItem
                              value={classification.label}
                              key={classification.value}
                              onSelect={() => {
                                form.setValue(
                                  "classification",
                                  classification.value
                                );
                                setCassificationopen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  classification.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {classification.label}
                            </CommandItem>
                          ))}
                          <CommandItem
                            onSelect={() => {
                              setDialogopen(true);
                            }}
                          >
                            <p className="mr-2 h-4 w-4">+</p>
                            <span>Add new</span>
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Amount" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit">Add</Button>
        </form>
      </Form>
    </div>
  );
};

export default RecordTransactionForm;
