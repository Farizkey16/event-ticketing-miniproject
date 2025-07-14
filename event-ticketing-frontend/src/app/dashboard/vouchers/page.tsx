"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { format } from "date-fns";
import { nanoid } from "nanoid";

type Voucher = {
  id: string;
  code: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  discountType: "fixed" | "percentage";
  discountValue: number;
};

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [formData, setFormData] = useState<Omit<Voucher, "id">>({
    code: "",
    startDate: "",
    endDate: "",
    usageLimit: 0,
    discountType: "fixed",
    discountValue: 0,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleGenerateCode = () => {
    const random = nanoid(8).toUpperCase();
    setFormData({ ...formData, code: random });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "usageLimit" || name === "discountValue"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = () => {
    const newVoucher: Voucher = {
      id: nanoid(),
      ...formData,
    };
    setVouchers([...vouchers, newVoucher]);
    setFormData({
      code: "",
      startDate: "",
      endDate: "",
      usageLimit: 0,
      discountType: "fixed",
      discountValue: 0,
    });
  };

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this voucher?"
    );
    if (!confirmDelete) return;

    setVouchers((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Voucher</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Voucher Code</Label>
            <div className="flex gap-2">
              <Input
                name="code"
                value={formData.code}
                onChange={handleChange}
              />
              <Button type="button" onClick={handleGenerateCode}>
                Generate
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Usage Limit</Label>
            <Input
              name="usageLimit"
              type="number"
              value={formData.usageLimit}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Discount Type</Label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="fixed">Fixed</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Discount Value</Label>
            <Input
              name="discountValue"
              type="number"
              value={formData.discountValue}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-full">
            <Button type="button" onClick={handleSubmit}>
              Add Voucher
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Vouchers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Usage Limit</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.code}</TableCell>
                  <TableCell>
                    {format(new Date(v.startDate), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(v.endDate), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>{v.usageLimit}</TableCell>
                  <TableCell>{v.discountType}</TableCell>
                  <TableCell>
                    {v.discountType === "percentage"
                      ? `${v.discountValue}%`
                      : `Rp${v.discountValue}`}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setSelectedId(v.id)}
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the voucher code{" "}
                            <strong>{v.code}</strong>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (selectedId) {
                                setVouchers((prev) =>
                                  prev.filter((v) => v.id !== selectedId)
                                );
                                setSelectedId(null);
                              }
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
