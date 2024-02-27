import {
  Box,
  Button,
  SxProps,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useCallback, useContext, useMemo, useState } from "react";
import EmotionContext, {
  CheckInOptions,
  EmotionCheckIn,
} from "../../EmotionContext";
import { useTranslation } from "react-i18next";

interface CheckInProps {
  onFinish: () => void;
}

const CheckIn = ({ onFinish }: CheckInProps) => {
  const [state, setState] = useState<EmotionCheckIn>(DEFAULT_STATE);
  const { t } = useTranslation();
  const { isRemind, addCheckin } = useContext(EmotionContext);

  const isDone = useMemo(
    () => state.happiness && state.moodScene && state.gratitudeObj,
    [state]
  );

  const handleSubmit = useCallback(() => {
    addCheckin({ ...state, ts: Date.now() });
    onFinish();
  }, [state, addCheckin, onFinish]);

  if (!isRemind) {
    return (
      <Box sx={rootSx}>
        <AccessTimeIcon fontSize="large" />
        <Typography variant="h6">
          {t("Already checked in, let's come back later")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={rootSx}>
      <Box sx={questionContainerSx}>
        <Typography variant="body1" alignSelf="flex-start" textAlign="start">
          1. {t("How happy were you in the past 24 hours?")}
        </Typography>
        <ToggleButtonGroup
          size="large"
          value={state.happiness}
          onChange={(_, v) => setState((prev) => ({ ...prev, happiness: v }))}
          exclusive
        >
          {CheckInOptions.happiness.map((v, idx) => (
            <ToggleButton value={v} key={`happiness-${idx}`}>
              <Typography variant="h6">{v}</Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      <Box sx={questionContainerSx}>
        <Typography variant="body1" alignSelf="flex-start" textAlign="start">
          2.{" "}
          {t(
            "What environment made you feel most profound in the past 24 hours?"
          )}
        </Typography>
        <ToggleButtonGroup
          size="large"
          value={state.moodScene}
          onChange={(_, v) => setState((prev) => ({ ...prev, moodScene: v }))}
          exclusive
          sx={{ flexWrap: "wrap", mx: 1 }}
        >
          {CheckInOptions.moodScene.map((v, idx) => (
            <ToggleButton
              value={v}
              key={`moodScene-${idx}`}
              sx={{ flexBasis: "33.3333%" }}
            >
              <Typography variant="h6">{t(v)}</Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      <Box sx={questionContainerSx}>
        <Typography variant="body1" alignSelf="flex-start" textAlign="start">
          3. {t("What are you most grateful for in the past 24 hours?")}
        </Typography>
        <ToggleButtonGroup
          size="large"
          value={state.gratitudeObj}
          onChange={(_, v) =>
            setState((prev) => ({ ...prev, gratitudeObj: v }))
          }
          exclusive
          sx={{ flexWrap: "wrap", mx: 1 }}
        >
          {CheckInOptions.gratitudeObj.map((v, idx) => (
            <ToggleButton
              value={v}
              key={`gratitudeObj-${idx}`}
              sx={{ flexBasis: "33.3333%" }}
            >
              <Typography variant="h6">{t(v)}</Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      <Button variant="outlined" disabled={!isDone} onClick={handleSubmit}>
        OK
      </Button>
    </Box>
  );
};

export default CheckIn;

const DEFAULT_STATE: EmotionCheckIn = {
  ts: 0,
};

const rootSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  flex: 1,
  gap: 4,
  p: 2,
};

const questionContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 1,
  mx: 2,
};
