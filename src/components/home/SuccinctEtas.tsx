import { useContext } from "react";
import { Box, SxProps, Theme, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEtas } from "../../hooks/useEtas";
import AppContext from "../../context/AppContext";
import { Eta } from "hk-bus-eta";
import { Schedule as ScheduleIcon } from "@mui/icons-material";
import LaptopIcon from "@mui/icons-material/Laptop";
import useLanguage from "../../hooks/useTranslation";

interface SuccinctEtasProps {
  routeId: string;
  value?: Eta[];
  isEndOfTrainLine?: boolean;
}

const SuccinctEtas = ({
  routeId,
  value = undefined,
  isEndOfTrainLine = false,
}: SuccinctEtasProps) => {
  const { t } = useTranslation();
  const language = useLanguage();
  const { etaFormat, annotateScheduled } = useContext(AppContext);
  const _etas = useEtas(routeId, Boolean(value));
  const etas = value ?? _etas;

  const getEtaString = (
    eta: Eta | null,
    seq: number,
    highlight: boolean = false
  ) => {
    if (!eta || !eta.eta) {
      if (isEndOfTrainLine && seq === 0) return t("終點站");
      return "";
    } else {
      const waitTime = Math.round(
        (new Date(eta.eta).getTime() - new Date().getTime()) / 60 / 1000
      );
      if (!Number.isInteger(waitTime)) {
        return eta.remark[language];
      }

      const { remark } = eta;
      const isScheduled =
        remark?.zh?.endsWith("班次") || remark?.en?.endsWith("Scheduled Bus");

      const trains =
        (/Platform [\d+] - (▭+)/gm.exec(remark?.en ?? "") ?? [])[1] ?? "";

      const exactTimeJsx = (
        <Box
          component="span"
          sx={{ fontSize: etaFormat !== "exact" ? "0.9em" : "1rem" }}
        >
          {isScheduled && annotateScheduled && (
            <>
              <ScheduleIcon sx={{ fontSize: "0.9em" }} />
              &nbsp;
            </>
          )}
          {trains.length === 1 && <SingleTrainIcon />}
          {trains.length === 2 && <DoubleTrainIcon />}
          {eta.eta.slice(11, 16)}
        </Box>
      );

      const isTrain = eta.co === "mtr" || eta.co === "lightRail";
      const waitTimeJsx = (
        <Box component="span">
          {etaFormat === "diff" && trains.length === 1 && <SingleTrainIcon />}
          {etaFormat === "diff" && trains.length === 2 && <DoubleTrainIcon />}
          <Box
            component="span"
            sx={{
              ...waitTimeSx,
              color: (theme) =>
                highlight ? theme.palette.warning.main : "inherit",
            }}
          >
            {isScheduled && annotateScheduled && etaFormat === "diff" && (
              <>
                <ScheduleIcon color="inherit" sx={{ fontSize: "0.9rem" }} />
                &nbsp;
              </>
            )}
            {waitTime < (isTrain ? 2 : 1) ? " - " : `${waitTime} `}
          </Box>
          <Box component="span" sx={{ fontSize: "0.8em" }}>
            {t("分鐘")}
          </Box>
        </Box>
      );
      switch (etaFormat) {
        case "exact":
          return exactTimeJsx;
        case "diff":
          return waitTimeJsx;
        default:
          return (
            <>
              {exactTimeJsx}&emsp;{waitTimeJsx}
            </>
          );
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" textAlign="right">
      <Typography component="h5" color="textPrimary" sx={primarySx}>
        {etas ? getEtaString(etas[0], 0, true) : ""}
      </Typography>
      <Typography component="h6" color="textSecondary" sx={secondarySx}>
        {etas ? getEtaString(etas[1], 1) : ""}
      </Typography>
      <Typography component="h6" color="textSecondary" sx={secondarySx}>
        {etas ? getEtaString(etas[2], 2) : ""}
      </Typography>
    </Box>
  );
};

export const SingleTrainIcon = () => (
  <LaptopIcon
    sx={{
      transform: "scaleY(-1)",
      verticalAlign: "middle",
      fontSize: "inherit",
      mr: 1,
    }}
  />
);

export const DoubleTrainIcon = () => (
  <>
    <LaptopIcon
      sx={{
        transform: "scaleY(-1)",
        verticalAlign: "middle",
        fontSize: "inherit",
      }}
    />
    <LaptopIcon
      sx={{
        transform: "scaleY(-1)",
        verticalAlign: "middle",
        fontSize: "inherit",
        mr: 1,
      }}
    />
  </>
);

export default SuccinctEtas;

const primarySx: SxProps<Theme> = {
  whiteSpace: "nowrap",
  fontSize: "1em",
};

const secondarySx: SxProps<Theme> = {
  fontSize: "0.875em",
  fontWeight: "400",
  lineHeight: "1.43",
  whiteSpace: "nowrap",
  textAlign: "right",
};

const waitTimeSx: SxProps<Theme> = {
  fontSize: "1.1em",
  fontWeight: "700",
  color: "#088bce",
};
