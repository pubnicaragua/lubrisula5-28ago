import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";

export default function ButtonAlert({ LabelButton, Onconfirm, title, description, variantButton }: { LabelButton: string, Onconfirm: () => void, title: string, description: string, variantButton: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary' }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={variantButton}>{LabelButton}</Button>
            </AlertDialogTrigger>
            <AlertDialogPortal>
                <AlertDialogOverlay className="AlertDialogOverlay" />
                <AlertDialogContent className="AlertDialogContent">
                    <AlertDialogTitle className="AlertDialogTitle">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="AlertDialogDescription">
                        {description}
                        {/* Este solicitud de taller sera rechazada y no podra ser recuperada. ¿seguro quedesea continuar? */}
                    </AlertDialogDescription>
                    <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
                        <AlertDialogCancel asChild>
                            <button className="Button mauve">Cancelar</button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <button className="Button red" onClick={Onconfirm ?? Onconfirm}>Continuar</button>
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialogPortal>
        </AlertDialog>
    );
}   