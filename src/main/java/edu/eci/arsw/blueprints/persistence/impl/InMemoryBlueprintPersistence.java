package edu.eci.arsw.blueprints.persistence.impl;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;

/**
 *
 * @author hcadavid
 */
@Service
public class InMemoryBlueprintPersistence implements BlueprintsPersistence {

    private final Map<Tuple<String, String>, Blueprint> blueprints = new ConcurrentHashMap<>();

    public InMemoryBlueprintPersistence() {
        // load stub data
        Point[] pts = new Point[]{new Point(140, 140), new Point(115, 115)};
        Blueprint bp = new Blueprint("_authorname_", "_bpname_ ", pts);
        blueprints.put(new Tuple<>(bp.getAuthor(), bp.getName()), bp);

        Point[] pts2 = new Point[]{new Point(0, 0), new Point(10, 10)};
        Blueprint bp2 = new Blueprint("mapu", "sala", pts2);
        blueprints.put(new Tuple<>(bp2.getAuthor(), bp2.getName()), bp2);

        Point[] pts3 = new Point[]{new Point(50, 50), new Point(100, 100)};
        Blueprint bp3 = new Blueprint("mapu", "comedor", pts3);
        blueprints.put(new Tuple<>(bp3.getAuthor(), bp3.getName()), bp3);

        Point[] pts4 = new Point[]{new Point(25, 25), new Point(75, 75)};
        Blueprint bp4 = new Blueprint("juan", "baño", pts4);
        blueprints.put(new Tuple<>(bp4.getAuthor(), bp4.getName()), bp4);

        Point[] catFacePoints = new Point[]{
            new Point(200, 140), new Point(175, 145), new Point(155, 160), new Point(145, 185),
            new Point(145, 215), new Point(155, 240), new Point(175, 255), new Point(200, 260),
            new Point(225, 255), new Point(245, 240), new Point(255, 215), new Point(255, 185),
            new Point(245, 160), new Point(225, 145), new Point(200, 140), new Point(155, 160),
            new Point(145, 130), new Point(160, 145), new Point(155, 160), new Point(245, 160),
            new Point(255, 130), new Point(240, 145), new Point(245, 160), new Point(200, 200),
            new Point(175, 190), new Point(170, 195), new Point(170, 200), new Point(175, 205),
            new Point(180, 200), new Point(180, 195), new Point(175, 190), new Point(200, 200),
            new Point(225, 190), new Point(220, 195), new Point(220, 200), new Point(225, 205),
            new Point(230, 200), new Point(230, 195), new Point(225, 190), new Point(200, 220),
            new Point(195, 228), new Point(205, 228), new Point(200, 220), new Point(200, 228),
            new Point(185, 235), new Point(200, 242), new Point(215, 235), new Point(200, 228),
            new Point(175, 225), new Point(140, 220), new Point(175, 225), new Point(140, 230),
            new Point(175, 225), new Point(225, 225), new Point(260, 220), new Point(225, 225),
            new Point(260, 230), new Point(225, 225)
        };

        Blueprint catFace = new Blueprint("mapunix", "catface", catFacePoints);
        blueprints.put(new Tuple<>(catFace.getAuthor(), catFace.getName()), catFace);
    }

    @Override
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        Tuple<String, String> key = new Tuple<>(bp.getAuthor(), bp.getName());
        Blueprint existing = blueprints.putIfAbsent(key, bp);
        if (existing != null) {
            throw new BlueprintPersistenceException("The given blueprint already exists: " + bp);
        }
    }

    @Override
    public Set<Blueprint> getAllBlueprints() {
        return new HashSet<>(blueprints.values());
    }

    @Override
    public Blueprint getBlueprint(String author, String bprintname) throws BlueprintNotFoundException {
        Blueprint bp = blueprints.get(new Tuple<>(author, bprintname));
        if (bp == null) {
            throw new BlueprintNotFoundException("Blueprint not found: " + author + "/" + bprintname);
        }
        return bp;
    }

    @Override
    public synchronized Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException {
        Set<Blueprint> res = new HashSet<>();
        for (Map.Entry<Tuple<String, String>, Blueprint> e : blueprints.entrySet()) {
            if (author.equals(e.getKey().getElem1())) {
                res.add(e.getValue());
            }
        }
        if (res.isEmpty()) {
            throw new BlueprintNotFoundException("No blueprints found for author: " + author);
        }
        return res;
    }

    @Override
    public synchronized void updateBlueprint(String author, String bprintname, Blueprint updatedBlueprint) throws BlueprintNotFoundException, BlueprintPersistenceException {
        Tuple<String, String> key = new Tuple<>(author, bprintname);

        if (!blueprints.containsKey(key)) {
            throw new BlueprintNotFoundException("Blueprint not found: " + author + "/" + bprintname);
        }

        Blueprint newBlueprint = new Blueprint(author, bprintname, updatedBlueprint.getPoints().toArray(new Point[0]));
        blueprints.put(key, newBlueprint);
    }

}
