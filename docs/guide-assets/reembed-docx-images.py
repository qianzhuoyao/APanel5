#!/usr/bin/env python3
"""把 live-zh / 标注图按图号写回 Abuilder使用文档与功能说明.docx（尽量只改 media，必要时拆分共用 rId）。"""
from __future__ import annotations

import os
import re
import shutil
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOCX = ROOT / "docs/Abuilder使用文档与功能说明.docx"
LIVE = Path(__file__).resolve().parent / "live-zh"
ANN = Path(__file__).resolve().parent

# 图号前缀 -> 源文件
CAPTION_SRC = {
    "图 2-1": ("ann", "fig1-overview-annotated.png"),
    "图 2-2": ("live", "01-overview.png"),
    "图 2-3": ("live", "05-materials-charts.png"),
    "图 2-4": ("live", "05b-materials-basic.png"),
    "图 2-5": ("live", "05c-materials-media.png"),
    "图 2-6": ("ann", "fig2-materials-annotated.png"),
    "图 2-7": ("ann", "fig2-canvas-chart-annotated.png"),
    "图 2-8": ("ann", "fig3-config-annotated.png"),
    "图 2-9": ("live", "03-config-chart-full.png"),
    "图 2-10": ("live", "14-layers.png"),
    "图 3-1": ("live", "20-search-materials.png"),
    "图 3-2": ("live", "23-node-tree-search.png"),
    "图 3-3": ("live", "22-search-config.png"),
    "图 4-1": ("live", "26-canvas-context-node.png"),
    "图 4-2": ("live", "26b-canvas-context-blank.png"),
    "图 5-1": ("live", "05-materials-charts.png"),
    "图 5-2": ("live", "05b-materials-basic.png"),
    "图 5-3": ("live", "05c-materials-media.png"),
    "图 7-1": ("live", "06-config-chart-top.png"),
    "图 8-1": ("live", "21-multiselect-full.png"),
    "图 8-2": ("live", "21b-multiselect-config.png"),
    "图 9-1": ("ann", "fig-chart-form-annotated.png"),
    "图 9-2": ("live", "06-config-chart-top.png"),
    "图 9-3": ("live", "06b-config-chart-data.png"),
    "图 9-4": ("live", "06c-config-chart-more.png"),
    "图 9-5": ("live", "30-config-pie.png"),
    "图 9-6": ("live", "31-config-gauge.png"),
    "图 10-1": ("ann", "fig-text-form-annotated.png"),
    "图 10-2": ("ann", "fig-text-annotated.png"),
    "图 10-3": ("live", "07-text-full.png"),
    "图 10-4": ("live", "07b-config-text.png"),
    "图 10-5": ("live", "07c-config-text-style.png"),
    "图 11-1": ("live", "09-table-full.png"),
    "图 11-2": ("live", "09b-config-table.png"),
    "图 11-3": ("live", "09c-config-table-cols.png"),
    "图 11-4": ("live", "09d-config-table-appearance.png"),
    "图 12-1": ("live", "10-config-image.png"),
    "图 12-2": ("live", "11-config-geometry.png"),
    "图 12-3": ("live", "12-config-audio.png"),
    "图 12-4": ("live", "13-config-video.png"),
    "图 12-5": ("ann", "fig-grid-form-annotated.png"),
    "图 12-6": ("ann", "fig-grid-annotated.png"),
    "图 12-7": ("live", "08-grid-full.png"),
    "图 12-8": ("live", "08b-config-grid.png"),
    "图 12-9": ("live", "32-config-3d.png"),
    "图 12-10": ("live", "33-config-viewport.png"),
    "图 12-11": ("live", "34-config-reference.png"),
    "图 13-1": ("live", "14-layers.png"),
    "图 13-2": ("live", "24-layers-bar.png"),
    "图 13-3": ("live", "25-layers-merge.png"),
    "图 14-1": ("live", "15-node-tree.png"),
    "图 14-2": ("live", "23-node-tree-search.png"),
    "图 15-1": ("live", "50-menu-file.png"),
    "图 15-2": ("live", "50b-menu-edit.png"),
    "图 15-3": ("live", "50c-menu-settings.png"),
    "图 15-4": ("live", "16-named.png"),
    "图 17-1": ("ann", "fig4-blueprint-annotated.png"),
    "图 17-2": ("ann", "fig4b-blueprint-node-annotated.png"),
    "图 17-3": ("live", "17-blueprint.png"),
    "图 17-4": ("live", "17b-blueprint-menu.png"),
    "图 17-5": ("live", "17c-blueprint-node.png"),
    "图 17-6": ("live", "17d-blueprint-clip.png"),
    "图 17-7": ("live", "40-blueprint-open.png"),
    "图 17-8": ("live", "41-blueprint-nodes.png"),
    "图 17-9": ("live", "42-blueprint-node-config.png"),
    "图 17-10": ("live", "43-blueprint-type-menu.png"),
    "图 17-11": ("live", "44-blueprint-save-dialog.png"),
    "图 17-12": ("live", "45-blueprint-log.png"),
    "图 18B-0": ("live", "demo-howto-wire.png"),
    "图 18B-1": ("live", "demo-a-json-chart.png"),
    "图 18B-2": ("live", "demo-b-clock-text.png"),
    "图 18B-3": ("live", "demo-c-and-gate.png"),
    "图 18B-4": ("live", "demo-d-event-click.png"),
    "图 18B-5": ("live", "demo-e-storage.png"),
}

W_T = re.compile(
    r"<w:t(?:\s[^>]*)?>([^<]*)</w:t>",
    re.M,
)


def fig_key(text: str) -> str | None:
    m = re.match(r"图\s*([\dA-Za-z]+-\d+)", text.strip())
    return f"图 {m.group(1)}" if m else None


def resolve(kind: str, name: str) -> Path:
    return (ANN if kind == "ann" else LIVE) / name


def paragraph_texts(doc_xml: str) -> list[tuple[int, int, str]]:
    """Return list of (start, end, plain_text) for each <w:p>...</w:p>."""
    out = []
    for m in re.finditer(r"<w:p[\s>][\s\S]*?</w:p>", doc_xml):
        chunk = m.group(0)
        texts = W_T.findall(chunk)
        plain = "".join(texts).strip()
        out.append((m.start(), m.end(), plain))
    return out


def main() -> None:
    if not DOCX.exists():
        raise SystemExit(f"missing {DOCX}")

    with tempfile.TemporaryDirectory(prefix="abuilder-docx-") as td:
        tmp = Path(td)
        with zipfile.ZipFile(DOCX, "r") as z:
            z.extractall(tmp)

        doc_path = tmp / "word/document.xml"
        rels_path = tmp / "word/_rels/document.xml.rels"
        media_dir = tmp / "word/media"
        doc_xml = doc_path.read_text(encoding="utf-8")
        rels_xml = rels_path.read_text(encoding="utf-8")

        rid_to_target = dict(
            re.findall(
                r'<Relationship[^>]*Id="(rId\d+)"[^>]*Target="(media/[^"]+)"',
                rels_xml,
            )
        )
        # also Target before Id
        for rid, tgt in re.findall(
            r'<Relationship[^>]*Target="(media/[^"]+)"[^>]*Id="(rId\d+)"',
            rels_xml,
        ):
            rid_to_target[tgt] = rid  # wrong — fix
        rid_to_target = {}
        for m in re.finditer(r"<Relationship\b[^>]*>", rels_xml):
            tag = m.group(0)
            rid_m = re.search(r'\bId="(rId\d+)"', tag)
            tgt_m = re.search(r'\bTarget="(media/[^"]+)"', tag)
            if rid_m and tgt_m:
                rid_to_target[rid_m.group(1)] = tgt_m.group(1)

        max_rid = max(int(r[3:]) for r in rid_to_target) if rid_to_target else 100
        next_img = 3000

        paras = paragraph_texts(doc_xml)
        # Collect image instances: list of (para_index, blip_match_span, rid, fig_key)
        instances: list[tuple[int, int, int, str, str]] = []
        for i, (start, end, plain) in enumerate(paras):
            chunk = doc_xml[start:end]
            for bm in re.finditer(
                r'<a:blip\b[^>]*\br:embed="(rId\d+)"[^>]*/?>', chunk
            ):
                # find caption nearby
                cap = ""
                for j in range(i, min(i + 3, len(paras))):
                    if fig_key(paras[j][2]):
                        cap = paras[j][2]
                        break
                if not cap:
                    for j in range(i - 1, max(i - 3, -1), -1):
                        if fig_key(paras[j][2]):
                            cap = paras[j][2]
                            break
                key = fig_key(cap) if cap else None
                if not key:
                    print("SKIP no caption near image in para", i)
                    continue
                abs_start = start + bm.start()
                abs_end = start + bm.end()
                instances.append((i, abs_start, abs_end, bm.group(1), key))

        # Process from end so string positions stay valid when rewriting embeds
        target_content: dict[str, Path] = {}  # media/xxx -> src
        ok = missing = cloned = 0
        new_rels: list[str] = []

        for i, abs_start, abs_end, rid, key in reversed(instances):
            if key not in CAPTION_SRC:
                print("SKIP unmapped", key)
                continue
            kind, name = CAPTION_SRC[key]
            src = resolve(kind, name)
            if not src.exists():
                print("MISSING", key, src)
                missing += 1
                continue
            tgt = rid_to_target.get(rid)
            if not tgt:
                print("SKIP no target", rid, key)
                continue

            existing = target_content.get(tgt)
            if existing is None:
                shutil.copyfile(src, tmp / "word" / tgt)
                target_content[tgt] = src
                print(f"OK {key} -> {tgt} ({name})")
                ok += 1
            elif existing.resolve() == src.resolve():
                print(f"OK reuse {key} -> {tgt}")
                ok += 1
            else:
                # shared rId wants different file → clone
                next_img += 1
                max_rid += 1
                new_name = f"image{next_img}.png"
                new_tgt = f"media/{new_name}"
                new_rid = f"rId{max_rid}"
                shutil.copyfile(src, media_dir / new_name)
                old_blip = doc_xml[abs_start:abs_end]
                new_blip = old_blip.replace(f'r:embed="{rid}"', f'r:embed="{new_rid}"')
                doc_xml = doc_xml[:abs_start] + new_blip + doc_xml[abs_end:]
                new_rels.append(
                    f'<Relationship Id="{new_rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="{new_tgt}"/>'
                )
                rid_to_target[new_rid] = new_tgt
                target_content[new_tgt] = src
                print(f"CLONE {key} -> {new_name} (was {tgt})")
                cloned += 1
                ok += 1

        if new_rels:
            if "</Relationships>" not in rels_xml:
                raise SystemExit("rels missing </Relationships>")
            rels_xml = rels_xml.replace(
                "</Relationships>", "\n".join(new_rels) + "\n</Relationships>"
            )

        doc_path.write_text(doc_xml, encoding="utf-8")
        rels_path.write_text(rels_xml, encoding="utf-8")

        out_tmp = DOCX.with_suffix(".docx.reembed-tmp")
        if out_tmp.exists():
            out_tmp.unlink()
        with zipfile.ZipFile(out_tmp, "w", compression=zipfile.ZIP_DEFLATED) as z:
            for dirpath, _, filenames in os.walk(tmp):
                for fn in filenames:
                    full = Path(dirpath) / fn
                    arc = full.relative_to(tmp).as_posix()
                    z.write(full, arc)
        out_tmp.replace(DOCX)
        print(f"done ok={ok} missing={missing} cloned={cloned} size={DOCX.stat().st_size}")


if __name__ == "__main__":
    main()
