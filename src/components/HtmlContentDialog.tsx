import DOMPurify from 'dompurify'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface HtmlContentDialogProps {
  open: boolean
  title: string
  html?: string
  onClose: () => void
}

export function HtmlContentDialog({ open, title, html, onClose }: HtmlContentDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {html ? (
          <Box
            sx={{ whiteSpace: 'pre-wrap', '& img': { maxWidth: '100%' } }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Aucune description
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  )
}
