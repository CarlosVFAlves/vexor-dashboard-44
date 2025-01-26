import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const contracts = [
  {
    id: 1,
    client: "Acme Corp",
    operator: "John Doe",
    status: "Pending",
  },
  {
    id: 2,
    client: "Globex Corp",
    operator: "Jane Smith",
    status: "Signed",
  },
  {
    id: 3,
    client: "Initech",
    operator: "Bob Johnson",
    status: "Pending",
  },
];

export const PendingContracts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Contracts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>{contract.client}</TableCell>
                <TableCell>{contract.operator}</TableCell>
                <TableCell>
                  <Badge
                    variant={contract.status === "Pending" ? "secondary" : "default"}
                  >
                    {contract.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Approve
                    </Button>
                    <Button variant="destructive" size="sm">
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};